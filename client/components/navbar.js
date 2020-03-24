import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {logout} from '../store';
import M from 'materialize-css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faProjectDiagram} from '@fortawesome/free-solid-svg-icons';

const Navbar = ({handleClick, isLoggedIn}) => {
  useEffect(() => {
    M.AutoInit();
  });

  return (
    <nav id="ourNav">
      <div className="nav-wrapper">
        {/* <FontAwesomeIcon className="icon" icon={faProjectDiagram} /> */}
        <Link to="/home" className="brand-logo" id="unicorn">
          Unicorn
        </Link>

        {isLoggedIn ? (
          <div>
            <ul className="right hide-on-med-and-down">
              {/* The navbar will show these links after you log in */}
              <li>
                <Link to="/home">Home</Link>
              </li>
              <li>
                <Link to="/compare">Compare</Link>
              </li>
              <li>
                <a href="#" onClick={handleClick}>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <div>
            <ul className="right hide-on-med-and-down">
              {/* The navbar will show these links before you log in */}
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id
  };
};

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout());
    }
  };
};

export default connect(mapState, mapDispatch)(Navbar);

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
};
