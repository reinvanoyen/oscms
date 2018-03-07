"use strict";

import ponnie from 'ponnie';
import Desktop from '../desktop/desktop';
import LoginScreen from './login-screen';

ponnie.register('desktop', Desktop);
ponnie.register('login-screen', LoginScreen);

export default class Root extends ponnie.Component {

  constructor() {
    super({
      isLoggedIn: false
    });
  }

  login() {

    this.update({
      isLoggedIn: true
    });
  }

  render() {

    if (!this.data.isLoggedIn) {
      return <login-screen p-login={this.login} />;
    }

    return <desktop />;
  }
}