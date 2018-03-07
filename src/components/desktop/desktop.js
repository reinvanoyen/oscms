"use strict";

import ponnie from 'ponnie';
import Taskbar from './taskbar';
import App from '../app/app';
import FileBrowser from '../fs/file-browser';

ponnie.register('taskbar', Taskbar);
ponnie.register('app', App);
ponnie.register('file-browser', FileBrowser);

let appId = 0;

export default class Desktop extends ponnie.Component {
  constructor() {
    super({
      installedApps: [
        {
          title: 'Pages'
        },
        {
          title: 'Projects'
        },
        {
          title: 'Media library'
        },
        {
          title: 'Inbox'
        }
      ],
      activeApps: []
    });
  }

  newAppProcess(i) {
    appId++;
    let appData = Object.assign({}, this.data.installedApps[i]);

    appData.id = appId;
    appData.index = i;
    appData.isFocus = false;
    appData.isMinize = false;
    appData.isMaximize = false;

    this.data.activeApps.push(appData);
    this.focusApp(appData.id);
  }

  focusNextApp() {
    this.data.activeApps.forEach(app => {
      if (!app.isMinimize && !app.isFocus) {
        this.focusApp(app.id);
      }
    });
  }

  closeApp(appId) {
    let reqAppIndex = this.data.activeApps.findIndex(app => app.id === appId);
    this.data.activeApps.splice(reqAppIndex, 1);
    this.update();
    this.focusNextApp();
  }

  toggleApp(appId) {
    this.data.activeApps.forEach(app => {
      if (app.id === appId) {
        if (app.isFocus) {
          this.minimizeApp(appId);
        } else {
          this.focusApp(appId);
        }
      }
    });
  }

  focusApp(appId) {
    console.log('focus', appId);
    this.data.activeApps.forEach(app => {
      app.isFocus = (app.id === appId);
      if (app.isFocus && app.isMinimize) {
        app.isMinimize = false;
      }
    });
    this.update();
  }

  blurApp(appId) {
    console.log('blur', appId);
    let reqApp = this.data.activeApps.find(app => app.id === appId);
    reqApp.isFocus = false;
    this.update();
  }

  minimizeApp(appId) {
    console.log('minimize', appId);
    this.data.activeApps.forEach(app => {
      if (app.id === appId) {
        app.isMinimize = true;
      }
    });
    this.blurApp(appId);
    this.focusNextApp();
  }

  maximizeApp(appId) {
    console.log('maximize', appId);
    this.data.activeApps.forEach(app => {
      if (app.id === appId) {
        app.isMaximize = true;
      }
    });
    this.update();
  }

  render() {
    return (
      <div class="desktop">
        <div class="desktop-apps">
          {this.data.installedApps.map((app, i) => {
            return <div p-dblclick={e => this.newAppProcess(i)}>{app.title}</div>
          })}
        </div>
        <div class="desktop-file-browser">
          <file-browser />
        </div>
        {this.data.activeApps.map(app => {
          return <app p-key={'app-'+app.id} title={this.data.installedApps[app.index].title} isMaximize={app.isMaximize} isMinimize={app.isMinimize} isFocus={app.isFocus} p-focus={e => this.focusApp(app.id)} p-maximize={e => this.maximizeApp(app.id)} p-close={e => this.closeApp(app.id)} p-minimize={e => this.minimizeApp(app.id)}/>
        })}
        <taskbar activeApps={this.data.activeApps} p-toggle={e => this.toggleApp(e.id)} />
      </div>
    );
  }
}