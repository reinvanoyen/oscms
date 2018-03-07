"use strict";

import ponnie from 'ponnie';
import File from './file';

ponnie.register('file', File);

export default class FileBrowser extends ponnie.Component {

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
      <div class="file-browser">
        <div class="file-browser-items">
          {this.data.dirs.map(dir => {
            return (
              <div class="file-browser-dir">
                {dir.name}
              </div>
            );
          })}
          {this.data.files.map(file => {
            return (
              <file name={file.name} />
            );
          })}
        </div>
      </div>
    );
  }
}