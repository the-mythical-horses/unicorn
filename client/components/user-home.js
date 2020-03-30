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
      <div id="featured">
        <div id="section1">
          <div id="welcome">
            <div id="welcome-text1">
              <h5>
                Welcome to <Link to="/">Unicorn</Link>
              </h5>
              <h6>
                the free <Link to="/compare">comparator</Link> that anyone can
                use for free (but{' '}
                <a href="http://www.lileks.com/institute/">donations</a> are
                welcomed)
              </h6>
            </div>
            <div id="welcome-text2">
              Im not sure what to put here, maybe an extended description?
            </div>
          </div>

          <div id="featComp">
            <div id="featComp-header">
              <h6>
                <b>Today's featured comparison</b>
              </h6>
            </div>
            <div id="featComp-content"></div>
          </div>
        </div>

        <div id="section2">
          <div id="section2-header">
            <h6>
              <b>Did you know...</b>
            </h6>
          </div>
          <div id="section2-content"></div>
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
