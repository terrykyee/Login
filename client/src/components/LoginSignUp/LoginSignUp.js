// @flow
/**
 * @file Login/Sign Up React component
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
import {LocalStorageUtilities, StorageKeys} from "../../lib/LocalStorageUtilities";

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
  rememberMe: boolean,
  validate: boolean,
}

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/i;

const ErrorMessages = {
  NOT_FOUND_MESSAGE: 'Your user name has not been registered, please visit the Sign Up page if you wish to register',
  UNAUTHENTICATED_MESSAGE: 'You have entered an invalid user name or password',
  SERVER_FAILED: 'Our service is currently offline, please try again later',
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
      rememberMe: false,
      passwordValid: false,
      validate: false,
    }
  }

  state: LoginSignUpStateType;
  props: LoginSignUpPropsType;

  componentWillMount = () => {
    this.retrieveUserInfo();
  };

  componentDidMount = () => {
    this.setState({
      validate: true,
    });
  };

  componentWillReceiveProps = (nextProps: LoginSignUpPropsType) => {
    if (this.props.login !== nextProps.login) {
      this.setState({
        error: '',
        loggedIn: false,
      });
    }
  };

  shouldComponentUpdate = (nextProps: LoginSignUpPropsType, nextState: LoginSignUpStateType) => {
    if (!this.state.rememberMe && nextState.rememberMe) {
      this.storeUserInfo(nextState);
    }

    if (this.state.rememberMe && !nextState.rememberMe) {
      this.removeUserInfo();
    }

    if (nextState.rememberMe &&
      (this.state.email !== nextState.email || this.state.password !== nextState.password)) {
      this.storeUserInfo(nextState);
    }

    return this.props !== nextProps || this.state !== nextState;
  };

  /**
   * Logout button clicked event handler.
   * @param event {SyntheticMouseEvent} Mouse click event.
   */
  logoutHandler = (event: SyntheticMouseEvent<*>) => {
    this.setState({
      firstName: '',
      lastName: '',
      // $FlowFixMe: suppressing this error regarding conditional define
      ...(!this.state.rememberMe) && { email: '' },
      // $FlowFixMe: suppressing this error regarding conditional define
      ...(!this.state.rememberMe) && { password: '' },
      error: '',
      loggedIn: false,
    });
  };

  /**
   * Remember me checkbox changed handler.
   * @param event {SyntheticMouseEvent} Mouse click event.
   */
  rememberMeCheckedHandler = (event: Object) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    this.setState({
      rememberMe: value,
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
            return;
          }

          this.setState({
            error: ErrorMessages.SERVER_FAILED,
            loggedIn: false,
          });
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
            error: ErrorMessages.SERVER_FAILED,
            loggedIn: false,
          });
        })
    }
  };

  /**
   * Remember me has been checked so store any current user info
   * @param userInfo User information to store
   */
  storeUserInfo = (userInfo: LoginSignUpStateType) => {
    LocalStorageUtilities.serializeItem(StorageKeys.USER_INFO, userInfo);
  };

  /**
   * Retrieve local storage
   */
  retrieveUserInfo = () => {
    const userInfo = LocalStorageUtilities.deserializeItem(StorageKeys.USER_INFO);

    if (userInfo) {
      this.setState({
        email: userInfo.email,
        password: userInfo.password,
        rememberMe: true,
      });
    }
  };

  /**
   * Remove stored user information
   */
  removeUserInfo = () => {
    LocalStorageUtilities.removeItem(StorageKeys.USER_INFO);
  };

  /**
   * Validate user entered data
   * @param props React properties
   * @param state React state
   * @returns {boolean} True if all fields valid when in sign in mode,
   * in login mode only email and password need to be valid, otherwise false
   */
  userDataValid = (props: LoginSignUpPropsType, state: LoginSignUpStateType): boolean => {
    let validName = true;

    if (!props.login) {
      validName = state.firstName && state.lastName;
    }

    console.log(validName);
    console.log(state.email.search(EMAIL_REGEX));
    console.log(state.password.search(PASSWORD_REGEX));
    return validName && state.email.search(EMAIL_REGEX) >= 0
      && state.password.search(PASSWORD_REGEX) >= 0;
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

    const rememberMe = this.props.login ? (
      <label
        htmlFor="rememberMe"
        className={"rememberMeLabel"}
      >
        {LoginDisplayStringConstants.REMEMBER_ME}
        <input
          id="rememberMe"
          type="checkbox"
          className="rememberMe"
          checked={this.state.rememberMe}
          onChange={this.rememberMeCheckedHandler}
          style={{opacity: 1}}
        />
      </label>
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
            validate={this.state.validate}
            validationCallback={res => this.setState({ validate: false })}
            placeholder={LoginDisplayStringConstants.FIRST_NAME_HINT}
            onChange={text => this.setState({firstName: text})}
            onBlur={() => {}}
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
            validate={this.state.validate}
            validationCallback={res => this.setState({ validate: false })}
            placeholder={LoginDisplayStringConstants.LAST_NAME_HINT}
            onChange={text => this.setState({lastName: text})}
            onBlur={() => {}}
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
              validate={this.state.validate}
              validationCallback={res => this.setState({ validate: false })}
              placeholder={LoginDisplayStringConstants.EMAIL_HINT}
              onChange={text => this.setState({email: text})}
              onBlur={() => {}}
              validationOption={{
                name: LoginDisplayStringConstants.EMAIL_LABEL,
                reg: EMAIL_REGEX,
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
              validate={this.state.validate}
              validationCallback={res => this.setState({ validate: false })}
              placeholder={LoginDisplayStringConstants.PASSWORD_HINT}
              onChange={text => this.setState({password: text})}
              onBlur={() => {}}
              validationOption={{
                name: LoginDisplayStringConstants.PASSWORD_LABEL,
                reg: PASSWORD_REGEX,
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
            disabled={!this.userDataValid(this.props, this.state)}
          >
            {this.props.login ? LoginDisplayStringConstants.LOGIN : LoginDisplayStringConstants.SIGN_UP}
          </button>
        </div>
        {rememberMe}
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

const LoginSignUp = LoginSignUpComponent;
export default LoginSignUp;
