// @flow
/**
 * @file Channel List Dropdown React Component
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import './LoginSignUp.css';
import { Textbox } from 'react-inputs-validation';
import { LoginDisplayStringConstants } from '../../lib/DisplayConstants';

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
}

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
      login: true,
    }
  }

  state: LoginSignUpStateType;
  props: LoginSignUpPropsType;

  /**
   * Render this React component.
   * @returns {XML}
   */
  render(): React.Node {
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
            onBlur={() => {
            }}
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
            onBlur={() => {
            }}
            validationOption={{
              name: LoginDisplayStringConstants.LAST_NAME_LABEL,
              check: true,
              required: true
            }}
          />
        </div>
      </div>
    ) : (<div></div>);

    return (
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
              onBlur={() => {
              }}
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
              onBlur={() => {
              }}
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
            onClick={() => {
            }}
          >
            {this.props.login ? LoginDisplayStringConstants.LOGIN : LoginDisplayStringConstants.SIGN_UP}
          </button>
        </div>
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
