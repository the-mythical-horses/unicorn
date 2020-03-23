import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
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
      <div>
        <h3>Welcome, {email}</h3>

        <p>Find All Objects With:</p>
        <form method="get" action="/search">
          <div className="input-field col s6">
            <label htmlFor="pname"></label>
            <input placeholder="Property Label" type="text" name="pname" />
          </div>
          <div className="input-field col s6">
            <label htmlFor="qname"></label>
            <input placeholder="Value Label" type="text" name="qname" />
          </div>
          <button type="submit" className="waves-effect waves-light btn">
            Submit
          </button>
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
