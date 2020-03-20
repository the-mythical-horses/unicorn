import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import wdk from 'wikidata-sdk';
import sparqljs from 'sparqljs';
import axios from 'axios';

/**
 * COMPONENT
 */
export class UserHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {result: []};
  }

  render() {
    const {email} = this.props;
    return (
      <div>
        <h3>Welcome, {email}</h3>

        <p>Find All Objects With:</p>
        <form method="get" action="/search">
          <label htmlFor="pname">Property label:</label>
          <input type="text" name="pname" />
          <label htmlFor="qname">Value label:</label>
          <input type="text" name="qname" />
          <button type="submit">Submit</button>
        </form>
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
