import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {logout} from '../store';
import M from 'materialize-css';

const Navbar = ({handleClick, isLoggedIn}) => {
  useEffect(() => {
    M.AutoInit();
  });

  return (
    <nav>
      <div className="nav-wrapper">
        <h2 className="brand-logo">Unicorn</h2>
        {isLoggedIn ? (
          <div>
            <ul className="right">
              <li>
                {/* The navbar will show these links after you log in */}
                <Link to="/home">Home</Link>
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
            {/* The navbar will show these links before you log in */}
            <Link to="/login" className="right">
              Login
            </Link>
            <Link to="/signup" className="right">
              Sign Up
            </Link>
          </div>
        )}
      </div>
      <hr />
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
