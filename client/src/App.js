import React from 'react';
import logo from './logo.svg';
import './App.css';
import LoginSignUp from "./components/LoginSignUp/LoginSignUp";
import { LoginDisplayStringConstants } from './lib/DisplayConstants';

// Flow type definitions for injected props
type AppInjectedPropsType = {
}

// Flow type definitions for connected props
type AppConnectedPropsType = {
}

// Flow type definitions for bound props
type AppBoundPropsType = {
}

type AppPropsType = AppInjectedPropsType &
  AppBoundPropsType & AppConnectedPropsType;

/**
 * The state declaration for the App state
 */
type AppStateType = {
  login: boolean,
}

class App extends React.Component<AppPropsType, AppStateType> {
  static propTypes = {};

  static defaultProps = {};

  constructor(props: AppPropsType) {
    super(props);

    this.state = {
      login: true,
    }
  }

  state: AppStateType;
  props: AppPropsType;

  /**
   * Render this React component.
   * @returns {XML}
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="buttonPane">
            <div className="buttonField">
              <button
                className="button"
                onClick={() => {
                  this.setState({login: true});
                }}
              >
                {LoginDisplayStringConstants.LOGIN}
              </button>
              <div className="text">or</div>
              <button
                className="button"
                onClick={() => {
                  this.setState({login: false});
                }}
              >
                {LoginDisplayStringConstants.SIGN_UP}
              </button>
            </div>
          </div>
          <h1 className="App-title">Welcome</h1>
        </header>
        <p className="App-intro">
        </p>
        <div className="login">
        <LoginSignUp
          login={this.state.login}
        />
        </div>
      </div>
    );
  }
}

export default App;
