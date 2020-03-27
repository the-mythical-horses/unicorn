/* eslint-disable complexity */
/* eslint-disable react/no-unused-state */
/* eslint-disable camelcase */
import React from 'react';
import {addProfileThunk, getProfileByIdThunk} from '../store/profiles';
import {connect} from 'react-redux';
import M from 'materialize-css';
import axios from 'axios';
import wdk from 'wikidata-sdk';

class Profile extends React.Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      qSearches: {},
      searches: {},
      form: {},
      data: {}
    };
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
      if (profile[key]) {
        ourIds.push(profile[key]);
      }
    }

    this.setState({form: profile, qSearches: profile});
    console.log('profile', profile);
    for (let key in this.state.qSearches) {
      if (this.state.qSearches[key] && this.state.qSearches[key][0] !== 'Q') {
        delete this.state.qSearches[key];
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
          form: {...this.state.form, [key]: entities[q1].labels.en}
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
        <form onSubmit={this.handleSubmit} className="col s12">
          <div className="row">
            <div className="input-field">
              {Object.keys(this.state.form).map(key => (
                <div key={key}>
                  <input
                    onChange={this.handleChange}
                    type="text"
                    name={key}
                    value={this.state.form[key] || ''}
                    autoComplete="off"
                  ></input>

                  <label htmlFor="key">
                    {key.split('_')[1].replace(/([A-Z])/g, ' $1')}
                  </label>

                  <div className="drop-containerX">
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

          <button type="submit">Create Profile</button>
        </form>
        <form
          action="./upload.php"
          mathode="POST"
          encType="multipart/form-data"
        >
          <input type="file" name="file" />
          <button type="submit" name="submit">
            Upload
          </button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  addProfileThunk: profile => dispatch(addProfileThunk(profile)),
  getProfileById: () => dispatch(getProfileByIdThunk())
});

const mapState = state => {
  return {
    profile: state.profiles.profile
  };
};
export default connect(mapState, mapDispatchToProps)(Profile);
