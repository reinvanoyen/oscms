"use strict";

import ponnie from 'ponnie';

export default class LoginScreen extends ponnie.Component {

  constructor() {
    super({
      isLoading: false
    });
  }

  login() {

    this.update({
      isLoading: true
    });

    setTimeout(() => {
      this.trigger('login');
    }, 1000);
  }

  render() {
    return (
      <div class={'login-screen' + (this.data.isLoading ? ' is-loading' : '')}>
        <div class="login-screen-widget">
          <div class="login-screen-title">Bolster.</div>
          <div>Bonjour, this is a demo login screen, just some temporary shizzle. Just press the button below to get to your desktop.</div>
          <button p-click={this.login} class="login-screen-button">Login</button>
        </div>
      </div>
    );
  }
}