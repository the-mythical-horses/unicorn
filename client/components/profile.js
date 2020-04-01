/* eslint-disable complexity */
/* eslint-disable react/no-unused-state */
/* eslint-disable camelcase */
import React from 'react';
import {addProfileThunk, getProfileByIdThunk, updateAvatar} from '../store';
import {connect} from 'react-redux';
import M from 'materialize-css';
import axios from 'axios';
import wdk from 'wikidata-sdk';
import user from '../store/user';
import {toast} from 'react-toastify';

class Profile extends React.Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fileSubmit = this.fileSubmit.bind(this);
    this.fileChange = this.fileChange.bind(this);

    this.state = {
      qSearches: {},
      searches: {},
      form: {},
      data: {},
      file: null
    };
  }

  async fileSubmit(evt) {
    evt.preventDefault();
    this.props.updateAvatar(this.state.file);
  }

  async fileChange(evt) {
    this.setState({
      file: evt.target.files[0]
    });
  }

  async componentDidMount() {
    M.AutoInit();

    await this.props.getProfileById();

    let rawProfile = await axios.get('/api/profiles/raw');
    let profile = rawProfile.data;
    let ourIds = [];

    // eslint-disable-next-line guard-for-in
    for (let key in profile) {
      if (
        key === 'id' ||
        key === 'userId' ||
        key === 'createdAt' ||
        key === 'updatedAt'
      ) {
        delete profile[key];
      }
    }
    this.setState({form: profile, qSearches: profile});
    for (let key in profile) {
      if (profile[key] && profile[key][0] === 'Q') {
        ourIds.push(profile[key]);
      }
    }

    let labels = await axios.get(
      wdk.getEntities({
        ids: ourIds,
        languages: ['en'],
        props: ['labels']
      })
    );
    let entities = wdk.simplify.entities(labels.data.entities);

    Object.keys(this.state.form).forEach(key => {
      let q1 = this.state.form[key];
      if (q1) {
        this.setState({
          form: {
            ...this.state.form,
            [key]: entities[q1] ? entities[q1].labels.en : q1
          }
        });
      }
    });
  }

  async handleChange(evt) {
    evt.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [evt.target.name]: evt.target.value
      },
      qSearches: {...this.state.qSearches, [evt.target.name]: ''}
    });
    if (this.state.form[evt.target.name].length > 0) {
      const qSearch = await axios.get(
        wdk.searchEntities(this.state.form[evt.target.name])
      );
      if (qSearch.data.search) {
        this.setState({
          searches: {
            ...this.state.searches,
            [evt.target.name]: qSearch.data.search.slice(0, 5)
          }
        });
      }
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const formCopy = {};
    Object.keys(this.state.form).forEach(key => {
      if (this.state.qSearches[key]) {
        formCopy[key] = this.state.qSearches[key];
      } else if (
        this.state.form[key] !== null &&
        !isNaN(this.state.form[key]) &&
        this.state.form[key] !== ''
      ) {
        formCopy[key] = +this.state.form[key];
      }
    });
    this.props.addProfileThunk(formCopy);
  }

  render() {
    return (
      <div className="row">
        <div id="propic-container">
          <div id="pro-message">
            <h4>
              Here you can create a profile to compare yourself with anything.
            </h4>
            <h4>Feel free to enter as much or as little info as you like.</h4>
            <h4>
              The more info provided, the more intersting the comparisons!
            </h4>
          </div>

          <div id="pro-container">
            <img id="propic-pic" src={this.props.avatar} />
            <form id="propic-form" onSubmit={this.fileSubmit}>
              <input type="file" name="avatar" onChange={this.fileChange} />
              <button type="submit" id="propic-btn">
                Save File
              </button>
            </form>
          </div>
        </div>

        <form onSubmit={this.handleSubmit}>
          <div className="row">
            <div id="input-container">
              {Object.keys(this.state.form).map(key => (
                <div key={key} className="input-fields">
                  <input
                    onChange={this.handleChange}
                    type="text"
                    name={key}
                    id="input"
                    value={this.state.form[key] || ''}
                    autoComplete="off"
                  ></input>

                  <label htmlFor="key" id="profile-labels">
                    {key.split('_')[1].replace(/([A-Z])/g, ' $1')}
                  </label>

                  <div className="drop-container">
                    <ul className="drop-list">
                      {this.state.searches[key] &&
                        this.state.searches[key].map(s => (
                          <li
                            className="drop-item"
                            key={s.id}
                            onClick={() =>
                              this.setState({
                                searches: {...this.state.searches, [key]: []},
                                qSearches: {
                                  ...this.state.qSearches,
                                  [key]: s.id
                                },
                                form: {...this.state.form, [key]: s.label}
                              })
                            }
                          >
                            <div className="drop-label">{s.label}</div>
                            <div className="drop-description">
                              {s.description}{' '}
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" id="save-profile-btn">
            Save Profile
          </button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  addProfileThunk: profile => dispatch(addProfileThunk(profile)),
  getProfileById: () => dispatch(getProfileByIdThunk()),
  updateAvatar: file => dispatch(updateAvatar(file))
});

const mapState = state => {
  return {
    profile: state.profile,
    user: state.user,
    avatar: state.user.avatar
  };
};
export default connect(mapState, mapDispatchToProps)(Profile);
