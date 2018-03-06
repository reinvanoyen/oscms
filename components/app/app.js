"use strict";

import ponnie from 'ponnie';
import MediaManager from '../media/manager/manager';

ponnie.register('media-manager', MediaManager);

export default class App extends ponnie.Component {

  constructor() {
    super({
      title: 'unknown',
      isFocus: false,
      isMaximize: false,
      isMinimize: false,
      positionStyle: 'top: ' + Math.floor(Math.random() * 50) + '%; left: ' + Math.floor(Math.random() * 50) + '%;'
    });
  }

  maximize(e) {
    if (!this.data.isMaximize) {
      this.trigger('maximize');
    }
    e.stopPropagation();
  }

  focus() {
    if (!this.data.isFocus) {
      this.trigger('focus');
    }
  }

  close(e) {
    this.trigger('close');
    e.stopPropagation();
  }

  minimize(e) {
    this.trigger('minimize');
    e.stopPropagation();
  }

  render() {
    console.log(this.data.isMaximize);
    return (
      <div class={'app' + (this.data.isFocus ? ' is-focus' : '') + (this.data.isMinimize ? ' is-minimize' : '') + (this.data.isMaximize ? ' is-maximize' : '')} style={this.data.positionStyle} p-click={this.focus}>
        <div class="app-header">
          <div class="app-header-title">{this.data.title}</div>
          <div class="app-header-actions">
            <button p-click={this.minimize}>-</button>
            <button p-click={this.maximize}>+</button>
            <button p-click={this.close}>x</button>
          </div>
        </div>
        <div class="app-content">
          <media-manager />
        </div>
      </div>
    );
  }
}