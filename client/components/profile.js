/* eslint-disable react/no-unused-state */
/* eslint-disable camelcase */
import React from 'react';
import {addProfileThunk} from '../store/profiles';
import {connect} from 'react-redux';
import M from 'materialize-css';

class Profile extends React.Component {
  constructor() {
    super();

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      form: {
        P1477_birthName: '',
        P735_givenName: '',
        P734_familyName: '',
        P569_dateOfBirth: '',
        P19_placeOfBirth: '',
        P1412_languagesSpokenWrittenOrSigned: '',
        P106_occupation: '',
        P69_educatedAt: '',
        P551_residence: '',
        P172_ethnicGroup: '',
        P140_religion: '',
        P2048_height: '',
        P27_countryOfCitizenship: '',
        P108_employer: '',
        P463_memberOf: '',
        P552_handedness: '',
        P101_fieldOfWork: '',
        P102_memberOfPoliticalParty: '',
        P1340_eyeColor: '',
        P1884_hairColor: '',
        P2067_mass: ''
      }
    };
  }

  componentDidMount() {
    M.AutoInit();
  }

  handleChange(event) {
    this.setState({
      form: {
        ...this.state.form,
        [event.target.name]: event.target.value
      }
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const formCopy = {...this.state.form};
    for (let key in formCopy) {
      if (!formCopy[key]) delete formCopy[key];
    }
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
                    value={this.state.form[key]}
                  ></input>
                  <label htmlFor="key">
                    {key.split('_')[1].replace(/([A-Z])/g, ' $1')}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <button type="submit">Create Profile</button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  addProfileThunk: profile => dispatch(addProfileThunk(profile))
});

export default connect(null, mapDispatchToProps)(Profile);
