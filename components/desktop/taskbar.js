"use strict";

import ponnie from 'ponnie';

export default class Taskbar extends ponnie.Component {
  constructor() {
    super({
      activeApps: []
    });
  }

  toggleApp(appId) {
    this.trigger('toggle', {id: appId});
  }

  render() {
    return (
      <div class="taskbar">
        {this.data.activeApps.map(app => {
          return (
            <div p-key={'app-'+app.id} class={'taskbar-item' + (app.isFocus ? ' is-focus' : '')} p-click={e => this.toggleApp(app.id)}>
              <div class="taskbar-item-icon"></div>
              <div class="taskbar-item-title">{app.title}</div>
            </div>
          );
        })}
      </div>
    );
  }
}