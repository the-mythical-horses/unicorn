/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import history from './../history';
import {Link} from 'react-router-dom';

import M from 'materialize-css';

/**
 * COMPONENT
 */
export class UserHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {result: []};
  }

  componentDidMount() {
    M.AutoInit();
  }

  render() {
    const {email} = this.props;
    return (
      <div id="home">
        {/* <h3>Welcome, {email}</h3> */}
        <div className="cards">
          <div className="row">
            <div className="col s12 m7">
              <div className="card medium">
                <div className="card-image" id="ci1">
                  <img src="./unicorn-2947687_1920.png" />
                  <span className="card-title" id="ci1t">
                    Research
                  </span>
                </div>
                <div className="card-content">
                  <p>
                    Use Unicorn as a launchboard for connecting research topics
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col s12 m7">
              <div className="card medium">
                <div className="card-image" id="ci2">
                  <img src="./unicorn-2947687_1920.png" />
                  <span className="card-title" id="ci2t">
                    Awareness
                  </span>
                </div>
                <div className="card-content">
                  <p>Discover the connection between everything.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col s12 m7">
              <div className="card medium">
                <div className="card-image" id="ci3">
                  <img src="./unicorn-2947687_1920.png" />
                  <span className="card-title" id="ci3t">
                    Data Extraction
                  </span>
                </div>
                <div className="card-content">
                  <p>Create extensive, meaningful data sets.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="intro-content">
          <p className="intro-header">
            A way to find the connections between anything.
          </p>
          <p>
            Unicorn is a fast, powerful search engine allowing anyone to find
            similarities between, well, anything.
          </p>
          <div>
            <button
              className="btn"
              id="try-it-btn"
              onClick={() => history.push('/Compare')}
            >
              Try it out
            </button>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    email: state.user.email
  };
};

export default connect(mapState)(UserHome);

/**
 * PROP TYPES
 */
UserHome.propTypes = {
  email: PropTypes.string
};
