"use strict";

import ponnie from 'ponnie';
import FileBrowser from '../file-browser';

ponnie.register('file-browser', FileBrowser);

export default class Manager extends ponnie.Component {
  constructor() {

    let rand = Math.floor( Math.random() * 5 );
    let dirs = [];
    let files = [];
    for (let i = 0; i < rand; i++) {
      dirs.push({
        name: 'My directory'
      });
    }

    rand = Math.floor( Math.random() * 20 );
    for (let i = 0; i < rand; i++) {
      files.push({
        name: 'My file'
      });
    }

    super({
      dirs: dirs,
      files: files
    });
  }

  render() {
    return (
      <div class="media-manager">
        <file-browser />
      </div>
    );
  }
}