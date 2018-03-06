"use strict";

import ponnie from 'ponnie';

export default class Manager extends ponnie.Component {
  constructor() {

    let rand = Math.floor( Math.random() * 35 );
    let dirs = [];
    for (let i = 0; i < rand; i++) {
      dirs.push({
        title: 'My directory'
      });
    }

    super({
      dirs: dirs,
      files: []
    });
  }

  fillRandom() {

    let rand = Math.floor( Math.random() * 20 );
    for (let i = 0; i < rand; i++) {
      this.data.dirs.push({
        title: 'My directory'
      });
    }
  }

  render() {
    return (
      <div class="media-manager">
        <div class="media-manager-items">
          {this.data.dirs.map(dir => {
            return (
              <div class="media-manager-dir">
                {dir.title}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}