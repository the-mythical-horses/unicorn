/* eslint-disable react/button-has-type */
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import history from './../history';
import {Link} from 'react-router-dom';
import wdk from 'wikidata-sdk';
import sparqljs from 'sparqljs';
import axios from 'axios';
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
                <div className="card-image">
                  <img src="./undraw_sync_files_xb3r.svg" />
                  <span className="card-title blue-text">Research</span>
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
                <div className="card-image">
                  <img src="./undraw_lost_online_wqob.svg" />
                  <span className="card-title blue-text">Awareness</span>
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
                <div className="card-image">
                  <img src="./undraw_data_extraction_ih3n (1).svg" />
                  <span className="card-title blue-text">Data Extraction</span>
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
              className="waves-effect waves-light btn"
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
