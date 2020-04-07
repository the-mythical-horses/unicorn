import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {auth} from '../store';
import M from 'materialize-css';

/**
 * COMPONENT
 */
const AuthForm = props => {
  const {name, displayName, handleSubmit, error} = props;

  useEffect(() => {
    M.AutoInit();
  });

  return (
    <div>
      <img
        src="/white-abstract-technology-and-engineering-motion-background-with-plexus-elements-and-depth-of-field-settings-3d-rendering_hwc2faa_e_thumbnail-full03.png"
        id="signup-img"
      />
      <div id="signup-form-main">
        <div>
          <h4 className="login-header">{displayName}</h4>
        </div>
        <form onSubmit={handleSubmit} name={name} id="signup-form-sub">
          <div className="input-field col s6">
            <label htmlFor="email" id="email">
              Email
            </label>
            <input
              className="validate"
              name="email"
              type="text"
              id="email-input"
            />
          </div>
          <div className="input-field col s6">
            <label htmlFor="password" id="password">
              Password
            </label>
            <input
              className="validate"
              name="password"
              type="password"
              id="password-input"
            />
          </div>
          <div>
            <button className="btn" id="signup-btn" type="submit">
              {displayName}
            </button>
          </div>
          {error && error.response && <div> {error.response.data} </div>}
        </form>
        {/* <div id="or">or</div>
        <a id="signup-google" href="/auth/google">
          <img id="google-icon" src="/img/googleIcon.png" />{' '}
          <div id="google-text">{displayName} with Google</div>
        </a> */}
        <div className="login-notmember">
          {displayName === 'Login' ? (
            <p className="notmember-p">
              Not a member?
              <Link to="/signup">Sign Up!</Link>
            </p>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.user.error
  };
};

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error
  };
};

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault();
      const formName = evt.target.name;
      const email = evt.target.email.value;
      const password = evt.target.password.value;
      dispatch(auth(email, password, formName));
    }
  };
};

export const Login = connect(mapLogin, mapDispatch)(AuthForm);
export const Signup = connect(mapSignup, mapDispatch)(AuthForm);

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
};
