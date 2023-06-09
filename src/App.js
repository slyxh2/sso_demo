import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, Security, SecureRoute } from '@okta/okta-react';
import Home from './Home';

const oktaAuth = new OktaAuth({
  issuer: 'https://dev-64126030.okta.com/oauth2/default',
  clientId: '${yourClientID}',
  redirectUri: window.location.origin + '/login/callback'
});

class App extends Component {

  constructor(props) {
    super(props);
    console.log(LoginCallback);
    this.restoreOriginalUri = async (_oktaAuth, originalUri) => {
      props.history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
    };
  }

  render() {
    return (
      <Security oktaAuth={oktaAuth} restoreOriginalUri={this.restoreOriginalUri}>
        <Route path="" component={Home} />
        <SecureRoute path="/secure" exact={true} component={<>This is SecureRoute</>} />
        <Route path="/login/callback" component={LoginCallback} />
      </Security>
    );
  }
}

const AppWithRouterAccess = withRouter(App);

class RouterApp extends Component {
  render() {
    return (<Router><AppWithRouterAccess /></Router>);
  }
}

export default RouterApp;
