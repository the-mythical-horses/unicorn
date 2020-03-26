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
        <h1>Here is where featured articles/comparisons should go</h1>
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
