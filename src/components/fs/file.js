"use strict";

import ponnie from 'ponnie';

export default class File extends ponnie.Component {

  constructor() {
    super({
      name: 'My file',
      size: '50kb',
      type: 'JPEG-image',
      isSelect: false
    });
  }

  toggle(e) {
    if(e.detail > 1){
      return;
    }

    this.update({
      isSelect: !this.data.isSelect
    })
  }

  open(e) {
    alert('now open' + this.data.name);
    e.stopPropagation();
  }

  render() {
    return (
      <div class={'file' + (this.data.isSelect ? ' is-select' : '')} p-click={this.toggle} p-dblclick={this.open}>
        <div class="file-name">{this.data.name}</div>
        <div class="file-type">{this.data.type}</div>
        <div class="file-size">{this.data.size}</div>
      </div>
    );
  }
}