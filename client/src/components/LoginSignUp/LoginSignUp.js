// @flow
/**
 * @file Channel List Dropdown React Component
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import './LoginSignUp.css';
import { Textbox } from 'react-inputs-validation';
import { LoginDisplayStringConstants } from '../../lib/DisplayConstants';
import { LoginServerRequests } from '../../lib/LoginServerRequests';
import {
  NotFoundDataAccessError,
  UnauthenticatedDataAccessError,
} from "../../lib/NetworkUtilities";
import type { LoginServerResponseType } from '../../lib/LoginServerRequests';

// Flow type definitions for injected props
type LoginSignUpInjectedPropsType = {
  login: boolean,
}

// Flow type definitions for connected props
type LoginSignUpConnectedPropsType = {
}

// Flow type definitions for bound props
type LoginSignUpBoundPropsType = {
}

type LoginSignUpPropsType = LoginSignUpInjectedPropsType &
  LoginSignUpBoundPropsType & LoginSignUpConnectedPropsType;

/**
 * The state declaration for the Login/Sign up state
 */
type LoginSignUpStateType = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  error: string,
  loggedIn: boolean,
}

const ErrorMessages = {
  NOT_FOUND_MESSAGE: 'Your user name has not been registered, please visit the Sign Up page if you wish to register',
  UNAUTHENTICATED_MESSAGE: 'You have entered an invalid user name or password',
  SIGN_UP_FAILED: 'The Sign Up service seems to be offline, please try again later',
};

/**
 * Login/Sign up React Component class
 */
class LoginSignUpComponent extends
  React.Component<LoginSignUpPropsType, LoginSignUpStateType> {
  static propTypes = {
    login: PropTypes.bool.isRequired,
  };

  static defaultProps = {};

  constructor(props: LoginSignUpPropsType) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      error: '',
      loggedIn: false,
    }
  }

  state: LoginSignUpStateType;
  props: LoginSignUpPropsType;

  componentWillReceiveProps = (nextProps: LoginSignUpPropsType) => {
    if (this.props.login !== nextProps.login) {
      this.setState({
        error: '',
        loggedIn: false,
      });
    }
  };

  /**
   * Logout button clicked event handler.
   * @param event {SyntheticMouseEvent} Mouse click event.
   */
  logoutHandler = (event: SyntheticMouseEvent<*>) => {
    this.setState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      error: '',
      loggedIn: false,
    });
  };

  /**
   * Login/Sign up button clicked event handler.
   * @param event {SyntheticMouseEvent} Mouse click event.
   */
  loginSignUpHandler = (event: SyntheticMouseEvent<*>) => {
    if (this.props.login) {
      LoginServerRequests.loginUser(this.state.email, this.state.password)
        .then((response: LoginServerResponseType) => {
          this.setState({
            firstName: response.firstName,
            lastName: response.lastName,
            error: '',
            loggedIn: true,
          });
        })
        .catch((error) => {
          if (error instanceof NotFoundDataAccessError) {
            this.setState({
              error: ErrorMessages.NOT_FOUND_MESSAGE,
              loggedIn: false,
            });
            return;
          }

          if (error instanceof UnauthenticatedDataAccessError) {
            this.setState({
              error: ErrorMessages.UNAUTHENTICATED_MESSAGE,
              loggedIn: false,
            });
          }
        })
    } else {
      LoginServerRequests.registerUser(
        this.state.firstName, this.state.lastName, this.state.email, this.state.password)
        .then((response: LoginServerResponseType) => {
          this.setState({
            error: '',
            loggedIn: true,
          });
        })
        .catch((error) => {
          this.setState({
            error: ErrorMessages.SIGN_UP_FAILED,
            loggedIn: false,
          });
        })
    }
  };

  /**
   * Render this React component.
   * @returns {XML}
   */
  render(): React.Node {
    const error = this.state.error ? (
      <div className="error">
        {this.state.error}
      </div>
    ) : (<div></div>);

    const firstNameField = !this.props.login ? (
      <div className="inputField">
        <div className="label">{LoginDisplayStringConstants.FIRST_NAME_LABEL}</div>
        <div className="input">
          <Textbox
            tabIndex="1"
            id={'firstName'}
            name={LoginDisplayStringConstants.FIRST_NAME_LABEL}
            type="text"
            value={this.state.firstName}
            placeholder={LoginDisplayStringConstants.FIRST_NAME_HINT}
            onChange={text => this.setState({firstName: text})}
            validationOption={{
              name: LoginDisplayStringConstants.FIRST_NAME_LABEL,
              check: true,
              required: true
            }}
          />
        </div>
      </div>
    ) : (<div></div>);

    const lastNameField = !this.props.login ? (
      <div className="inputField">
        <div className="label">{LoginDisplayStringConstants.LAST_NAME_LABEL}</div>
        <div className="input">
          <Textbox
            tabIndex="2"
            id={'lastName'}
            name={LoginDisplayStringConstants.LAST_NAME_LABEL}
            type="text"
            value={this.state.lastName}
            placeholder={LoginDisplayStringConstants.LAST_NAME_HINT}
            onChange={text => this.setState({lastName: text})}
            validationOption={{
              name: LoginDisplayStringConstants.LAST_NAME_LABEL,
              check: true,
              required: true
            }}
          />
        </div>
      </div>
    ) : (<div></div>);

    const contents = this.state.loggedIn ? (
      <div className="main">
        <div className="loggedIn">
          {`Hello, ${this.state.firstName} ${this.state.lastName}`}
        </div>
        <div className="loginButtonPane">
          <button
            className="loginButton"
            onClick={this.logoutHandler}
          >
            {LoginDisplayStringConstants.LOGOUT}
          </button>
        </div>
      </div>
    ) : (
      <div className="main">
        {firstNameField}
        {lastNameField}
        <div className="inputField">
          <div className="label">
            {this.props.login ? LoginDisplayStringConstants.USERNAME_LABEL : LoginDisplayStringConstants.EMAIL_LABEL}
          </div>
          <div className="input">
            <Textbox
              tabIndex="3"
              id={'email'}
              name={LoginDisplayStringConstants.EMAIL_LABEL}
              type="text"
              value={this.state.email}
              placeholder={LoginDisplayStringConstants.EMAIL_HINT}
              onChange={text => this.setState({email: text})}
              validationOption={{
                name: LoginDisplayStringConstants.EMAIL_LABEL,
                reg: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                required: true,
                regMsg: 'This doesn\'t seem to be a valid email address'
              }}
            />
          </div>
        </div>
        <div className="inputField">
          <div className="label">{LoginDisplayStringConstants.PASSWORD_LABEL}</div>
          <div className="input">
            <Textbox
              tabIndex="4"
              id={'password'}
              name={LoginDisplayStringConstants.PASSWORD_LABEL}
              type="password"
              value={this.state.password}
              placeholder={LoginDisplayStringConstants.PASSWORD_HINT}
              onChange={text => this.setState({password: text})}
              validationOption={{
                name: LoginDisplayStringConstants.PASSWORD_LABEL,
                reg: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i,
                required: true,
                regMsg: 'Password must be at least 8 characters with at least one letter and one number'
              }}
            />
          </div>
        </div>
        <div className="loginButtonPane">
          <button
            className="loginButton"
            onClick={this.loginSignUpHandler}
          >
            {this.props.login ? LoginDisplayStringConstants.LOGIN : LoginDisplayStringConstants.SIGN_UP}
          </button>
        </div>
        {error}
      </div>
    );
    return (
      <div>
        {contents}
      </div>
    );
  }
}

/*
// Unconnected component for unit testing
export const UnconnectedLoginSignUp = LoginSignUpComponent;

// Connect LoginSignUp to allow actions to be emitted via dispatch
const LoginSignUp = connect(
  LoginSignUpComponent.mapStateToProps,
)(LoginSignUpComponent);
*/

const LoginSignUp = LoginSignUpComponent;
export default LoginSignUp;
