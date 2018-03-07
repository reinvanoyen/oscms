(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vdom = require("./vdom");

var _vdom2 = _interopRequireDefault(_vdom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = function () {
  function Component() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Component);

    this._currentVirtualNode = null;
    this.root = null;
    this.parent = null;
    this.data = data;
    this.eventListeners = {};
    this.refs = {};
  }

  _createClass(Component, [{
    key: "createElement",
    value: function createElement() {

      this.root = document.createElement('div');
      _vdom2.default.patchComponent(this);
      this.trigger('create');
      return this.root;
    }
  }, {
    key: "unmount",
    value: function unmount() {

      this.root.parentNode.removeChild(this.root);
      this.root = null;
      this.trigger('unmount');
    }
  }, {
    key: "update",
    value: function update(data) {
      var patch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;


      Object.assign(this.data, data);
      this.trigger('update', { data: data });
      if (patch) {
        _vdom2.default.patchComponent(this);
      }
    }

    // events

  }, {
    key: "on",
    value: function on(eventName, cb) {

      if (typeof this.eventListeners[eventName] === 'undefined') {
        this.eventListeners[eventName] = [];
      }

      this.eventListeners[eventName].push(cb);
    }
  }, {
    key: "off",
    value: function off(eventName) {

      if (typeof this.eventListeners[eventName] !== 'undefined') {
        delete this.eventListeners[eventName];
      }
    }
  }, {
    key: "trigger",
    value: function trigger(eventName, arg) {
      if (typeof this.eventListeners[eventName] !== 'undefined') {
        this.eventListeners[eventName].forEach(function (cb) {
          return cb(arg);
        });
      }
    }
  }, {
    key: "render",
    value: function render() {}
  }]);

  return Component;
}();

exports.default = Component;
},{"./vdom":4}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _vnode = require("./vnode");

var _vnode2 = _interopRequireDefault(_vnode);

var _registry = require("./registry");

var _component = require("./component");

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ponnie = {
  Component: _component2.default,
  register: _registry.TagRegistry.add.bind(_registry.TagRegistry),
  mount: function mount(component, htmlEl) {
    htmlEl.appendChild(component.createElement());
    component.trigger('mount');
  },
  vnode: _vnode2.default
};

exports.default = ponnie;
},{"./component":1,"./registry":3,"./vnode":5}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Registry = function () {
  function Registry() {
    _classCallCheck(this, Registry);

    this.store = {};
  }

  _createClass(Registry, [{
    key: "add",
    value: function add(key, value) {
      this.store[key] = value;
    }
  }, {
    key: "get",
    value: function get(key) {
      return this.store[key];
    }
  }]);

  return Registry;
}();

var TagRegistry = new Registry();
var ComponentRegistry = new Registry();

exports.TagRegistry = TagRegistry;
exports.ComponentRegistry = ComponentRegistry;
},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _registry = require("./registry");

var componentId = 0;

// @TODO make sure currentComponent is always correct

var vdom = {
  currentComponent: null,
  patchComponent: function patchComponent(component) {

    vdom.currentComponent = component;

    // render the component to get the new virtual node
    var newVirtualNode = component.render();

    // update the component, comparing the new virtual node with the current virtual node
    vdom.updateElement(component.root, newVirtualNode, component._currentVirtualNode);

    // store the new virtual node as the current virtual node
    component._currentVirtualNode = newVirtualNode;

    // trigger the render event
    component.trigger('render');

    if (component.parent) {
      vdom.currentComponent = component.parent;
    }
  },
  updateElement: function updateElement(parentEl, newVNode, oldVNode) {
    var index = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;


    // check if we are updating a component
    if (oldVNode && _registry.TagRegistry.get(oldVNode.tag)) {

      var componentInstance = _registry.ComponentRegistry.get(oldVNode.componentId);

      if (!newVNode) {

        // no newNode found, unmount the component
        componentInstance.unmount();
      } else if (vdom.isDiff(newVNode, oldVNode)) {

        // newNode looks different, replace the component
        parentEl.replaceChild(vdom.createElement(newVNode), parentEl.childNodes[index]);
      } else {

        // update the component with the new attributes
        newVNode.componentId = oldVNode.componentId;
        componentInstance.update(newVNode.attrs);
      }
    } else {

      if (!newVNode && !oldVNode) {
        return;
      }

      if (!oldVNode) {

        parentEl.appendChild(vdom.createElement(newVNode));
      } else if (!newVNode) {

        vdom.removeElement(parentEl, oldVNode, index);
      } else if (vdom.isDiff(newVNode, oldVNode)) {

        parentEl.replaceChild(vdom.createElement(newVNode), parentEl.childNodes[index]);
      } else if (newVNode.tag && parentEl) {

        vdom.updateAttributes(parentEl.childNodes[index], newVNode.attrs, oldVNode.attrs);

        var newLength = newVNode.children.length;
        var oldLength = oldVNode.children.length;

        for (var i = 0; i < newLength || i < oldLength; i++) {

          vdom.updateElement(parentEl.childNodes[index], newVNode.children[i], oldVNode.children[i], i);
        }
      }
    }
  },
  createElement: function createElement(vnode) {

    if (typeof vnode === 'string' || typeof vnode === 'number') {

      // the virtual node is a string or number, so create a textnode
      return document.createTextNode(vnode);
    }

    var component = _registry.TagRegistry.get(vnode.tag);

    if (component) {

      // it is a custom component
      var componentInstance = new component();
      componentInstance.parent = vdom.currentComponent;

      // set the newly created component instance as the current component
      //vdom.currentComponent = componentInstance;

      // update the component instance with the attrs
      componentInstance.update(vnode.attrs, false);

      // generate an id for the component
      componentId++;
      vnode.componentId = componentId;

      // store the component instance by id
      _registry.ComponentRegistry.add(componentId, componentInstance);

      // process attributes and events for this component
      var attrs = vnode.attrs || {};

      Object.keys(attrs).forEach(function (name) {

        if (vdom.isRefAttribute(name)) {

          // set reference to this component instance
          vdom.currentComponent.refs[attrs[name]] = componentInstance;
        } else if (vdom.isEventAttribute(name)) {

          // bind event to component
          var e = attrs[name].bind(vdom.currentComponent);
          componentInstance.on(vdom.getEventNameFromAttribute(name), e);
        }
      });

      // finally create the HTMLElement
      var el = componentInstance.createElement();

      // set the current component back to the parent of the created component
      //vdom.currentComponent = componentInstance.parent;

      // give back the HTMLElement
      return el;
    } else {

      var _el = document.createElement(vnode.tag);
      var _attrs = vnode.attrs || {};

      Object.keys(_attrs).forEach(function (name) {

        if (vdom.isRefAttribute(name)) {

          // set reference
          vdom.currentComponent.refs[_attrs[name]] = _el;
        } else if (vdom.isEventAttribute(name)) {

          // bind event
          var e = _attrs[name].bind(vdom.currentComponent);
          vdom.bindEvent(_el, vdom.getEventNameFromAttribute(name), e);
        } else {

          vdom.setAttribute(_el, name, _attrs[name]);
        }
      });

      vnode.children.forEach(function (vnodeChild) {
        _el.appendChild(vdom.createElement(vnodeChild));
      });

      return _el;
    }
  },
  removeElement: function removeElement(parentEl, vnode, index) {

    if (typeof vnode === 'string' || typeof vnode === 'number' || !_registry.TagRegistry.get(vnode.tag)) {

      // it's either a string, number or HTMLElement
      parentEl.removeChild(parentEl.childNodes[index]);
      return;
    }

    // it should be a custom component, find the component instance and unmount it
    _registry.ComponentRegistry.get(vnode.componentId).unmount();
  },
  setAttribute: function setAttribute(targetEl, name, value) {

    // is custom attribute
    if (vdom.isCustomAttribute(name)) {
      return;
    }

    // is boolean attribute
    if (typeof value === 'boolean') {
      if (!value) {
        return;
      } else {
        targetEl[name] = true;
      }
    }

    // is class attribute
    if (name === 'className') {
      name = 'class';
    }

    // set the attribute
    targetEl.setAttribute(name, value);
  },
  updateAttribute: function updateAttribute(targetEl, name, newVal, oldVal) {

    if (!newVal) {

      vdom.removeAttribute(targetEl, name, newVal);
    } else if (!oldVal || newVal !== oldVal) {

      vdom.setAttribute(targetEl, name, newVal);
    }
  },
  updateAttributes: function updateAttributes(targetEl, newAttrs) {
    var oldAttrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


    var props = Object.assign({}, newAttrs, oldAttrs);

    Object.keys(props).forEach(function (name) {

      vdom.updateAttribute(targetEl, name, newAttrs[name], oldAttrs[name]);
    });
  },
  removeAttribute: function removeAttribute(targetEl, name, newVal) {

    if (typeof newVal === 'boolean') {
      targetEl[name] = false;
    }

    if (name === 'className') {
      name = 'class';
    }

    targetEl.removeAttribute(name);
  },
  isCustomAttribute: function isCustomAttribute(name) {

    return vdom.isRefAttribute(name) || name === 'p-key' || vdom.isEventAttribute(name);
  },
  isRefAttribute: function isRefAttribute(name) {

    return name === 'p-ref';
  },
  isEventAttribute: function isEventAttribute(name) {

    return name !== 'p-key' && /^p-/.test(name);
  },
  getEventNameFromAttribute: function getEventNameFromAttribute(name) {

    return name.slice(2).toLowerCase();
  },
  bindEvent: function bindEvent(targetEl, eventName, func) {

    targetEl.addEventListener(eventName, func);
  },

  isDiff: function isDiff(node1, node2) {

    return (typeof node1 === "undefined" ? "undefined" : _typeof(node1)) !== (typeof node2 === "undefined" ? "undefined" : _typeof(node2)) || (typeof node1 === 'string' || typeof node1 === 'number') && node1 !== node2 || node1.tag !== node2.tag || (node1.attrs && node1.attrs['p-key'] || node2.attrs && node2.attrs['p-key']) && (!node1.attrs['p-key'] || !node2.attrs['p-key'] || node1.attrs['p-key'] !== node2.attrs['p-key']) // @TODO this could be improved
    ;
  }
};

exports.default = vdom;
},{"./registry":3}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = h;
function h(tag, attrs) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  children = [].concat.apply([], children);
  return { tag: tag, attrs: attrs, children: children };
}
},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ponnie = require('ponnie');

var _ponnie2 = _interopRequireDefault(_ponnie);

var _manager = require('../fs/manager/manager');

var _manager2 = _interopRequireDefault(_manager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_ponnie2.default.register('file-manager', _manager2.default);

var App = function (_ponnie$Component) {
  _inherits(App, _ponnie$Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, {
      title: 'unknown',
      isFocus: false,
      isMaximize: false,
      isMinimize: false,
      positionStyle: 'top: ' + Math.floor(Math.random() * 50) + '%; left: ' + Math.floor(Math.random() * 50) + '%;'
    }));
  }

  _createClass(App, [{
    key: 'maximize',
    value: function maximize(e) {
      if (!this.data.isMaximize) {
        this.trigger('maximize');
      }
      e.stopPropagation();
    }
  }, {
    key: 'focus',
    value: function focus() {
      if (!this.data.isFocus) {
        this.trigger('focus');
      }
    }
  }, {
    key: 'close',
    value: function close(e) {
      this.trigger('close');
      e.stopPropagation();
    }
  }, {
    key: 'minimize',
    value: function minimize(e) {
      this.trigger('minimize');
      e.stopPropagation();
    }
  }, {
    key: 'render',
    value: function render() {
      console.log(this.data.isMaximize);
      return _ponnie2.default.vnode(
        'div',
        { 'class': 'app' + (this.data.isFocus ? ' is-focus' : '') + (this.data.isMinimize ? ' is-minimize' : '') + (this.data.isMaximize ? ' is-maximize' : ''), style: this.data.positionStyle, 'p-click': this.focus },
        _ponnie2.default.vnode(
          'div',
          { 'class': 'app-header' },
          _ponnie2.default.vnode(
            'div',
            { 'class': 'app-header-title' },
            this.data.title
          ),
          _ponnie2.default.vnode(
            'div',
            { 'class': 'app-header-actions' },
            _ponnie2.default.vnode(
              'button',
              { 'p-click': this.minimize },
              '-'
            ),
            _ponnie2.default.vnode(
              'button',
              { 'p-click': this.maximize },
              '+'
            ),
            _ponnie2.default.vnode(
              'button',
              { 'p-click': this.close },
              'x'
            )
          )
        ),
        _ponnie2.default.vnode(
          'div',
          { 'class': 'app-content' },
          _ponnie2.default.vnode('file-manager', null)
        )
      );
    }
  }]);

  return App;
}(_ponnie2.default.Component);

exports.default = App;

},{"../fs/manager/manager":11,"ponnie":2}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ponnie = require('ponnie');

var _ponnie2 = _interopRequireDefault(_ponnie);

var _taskbar = require('./taskbar');

var _taskbar2 = _interopRequireDefault(_taskbar);

var _app = require('../app/app');

var _app2 = _interopRequireDefault(_app);

var _fileBrowser = require('../fs/file-browser');

var _fileBrowser2 = _interopRequireDefault(_fileBrowser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_ponnie2.default.register('taskbar', _taskbar2.default);
_ponnie2.default.register('app', _app2.default);
_ponnie2.default.register('file-browser', _fileBrowser2.default);

var appId = 0;

var Desktop = function (_ponnie$Component) {
  _inherits(Desktop, _ponnie$Component);

  function Desktop() {
    _classCallCheck(this, Desktop);

    return _possibleConstructorReturn(this, (Desktop.__proto__ || Object.getPrototypeOf(Desktop)).call(this, {
      installedApps: [{
        title: 'Pages'
      }, {
        title: 'Projects'
      }, {
        title: 'Media library'
      }, {
        title: 'Inbox'
      }],
      activeApps: []
    }));
  }

  _createClass(Desktop, [{
    key: 'newAppProcess',
    value: function newAppProcess(i) {
      appId++;
      var appData = Object.assign({}, this.data.installedApps[i]);

      appData.id = appId;
      appData.index = i;
      appData.isFocus = false;
      appData.isMinize = false;
      appData.isMaximize = false;

      this.data.activeApps.push(appData);
      this.focusApp(appData.id);
    }
  }, {
    key: 'focusNextApp',
    value: function focusNextApp() {
      var _this2 = this;

      this.data.activeApps.forEach(function (app) {
        if (!app.isMinimize && !app.isFocus) {
          _this2.focusApp(app.id);
        }
      });
    }
  }, {
    key: 'closeApp',
    value: function closeApp(appId) {
      var reqAppIndex = this.data.activeApps.findIndex(function (app) {
        return app.id === appId;
      });
      this.data.activeApps.splice(reqAppIndex, 1);
      this.update();
      this.focusNextApp();
    }
  }, {
    key: 'toggleApp',
    value: function toggleApp(appId) {
      var _this3 = this;

      this.data.activeApps.forEach(function (app) {
        if (app.id === appId) {
          if (app.isFocus) {
            _this3.minimizeApp(appId);
          } else {
            _this3.focusApp(appId);
          }
        }
      });
    }
  }, {
    key: 'focusApp',
    value: function focusApp(appId) {
      console.log('focus', appId);
      this.data.activeApps.forEach(function (app) {
        app.isFocus = app.id === appId;
        if (app.isFocus && app.isMinimize) {
          app.isMinimize = false;
        }
      });
      this.update();
    }
  }, {
    key: 'blurApp',
    value: function blurApp(appId) {
      console.log('blur', appId);
      var reqApp = this.data.activeApps.find(function (app) {
        return app.id === appId;
      });
      reqApp.isFocus = false;
      this.update();
    }
  }, {
    key: 'minimizeApp',
    value: function minimizeApp(appId) {
      console.log('minimize', appId);
      this.data.activeApps.forEach(function (app) {
        if (app.id === appId) {
          app.isMinimize = true;
        }
      });
      this.blurApp(appId);
      this.focusNextApp();
    }
  }, {
    key: 'maximizeApp',
    value: function maximizeApp(appId) {
      console.log('maximize', appId);
      this.data.activeApps.forEach(function (app) {
        if (app.id === appId) {
          app.isMaximize = true;
        }
      });
      this.update();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      return _ponnie2.default.vnode(
        'div',
        { 'class': 'desktop' },
        _ponnie2.default.vnode(
          'div',
          { 'class': 'desktop-apps' },
          this.data.installedApps.map(function (app, i) {
            return _ponnie2.default.vnode(
              'div',
              { 'p-dblclick': function pDblclick(e) {
                  return _this4.newAppProcess(i);
                } },
              app.title
            );
          })
        ),
        _ponnie2.default.vnode(
          'div',
          { 'class': 'desktop-file-browser' },
          _ponnie2.default.vnode('file-browser', null)
        ),
        this.data.activeApps.map(function (app) {
          return _ponnie2.default.vnode('app', { 'p-key': 'app-' + app.id, title: _this4.data.installedApps[app.index].title, isMaximize: app.isMaximize, isMinimize: app.isMinimize, isFocus: app.isFocus, 'p-focus': function pFocus(e) {
              return _this4.focusApp(app.id);
            }, 'p-maximize': function pMaximize(e) {
              return _this4.maximizeApp(app.id);
            }, 'p-close': function pClose(e) {
              return _this4.closeApp(app.id);
            }, 'p-minimize': function pMinimize(e) {
              return _this4.minimizeApp(app.id);
            } });
        }),
        _ponnie2.default.vnode('taskbar', { activeApps: this.data.activeApps, 'p-toggle': function pToggle(e) {
            return _this4.toggleApp(e.id);
          } })
      );
    }
  }]);

  return Desktop;
}(_ponnie2.default.Component);

exports.default = Desktop;

},{"../app/app":6,"../fs/file-browser":9,"./taskbar":8,"ponnie":2}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ponnie = require('ponnie');

var _ponnie2 = _interopRequireDefault(_ponnie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Taskbar = function (_ponnie$Component) {
  _inherits(Taskbar, _ponnie$Component);

  function Taskbar() {
    _classCallCheck(this, Taskbar);

    return _possibleConstructorReturn(this, (Taskbar.__proto__ || Object.getPrototypeOf(Taskbar)).call(this, {
      activeApps: []
    }));
  }

  _createClass(Taskbar, [{
    key: 'toggleApp',
    value: function toggleApp(appId) {
      this.trigger('toggle', { id: appId });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      return _ponnie2.default.vnode(
        'div',
        { 'class': 'taskbar' },
        this.data.activeApps.map(function (app) {
          return _ponnie2.default.vnode(
            'div',
            { 'p-key': 'app-' + app.id, 'class': 'taskbar-item' + (app.isFocus ? ' is-focus' : ''), 'p-click': function pClick(e) {
                return _this2.toggleApp(app.id);
              } },
            _ponnie2.default.vnode('div', { 'class': 'taskbar-item-icon' }),
            _ponnie2.default.vnode(
              'div',
              { 'class': 'taskbar-item-title' },
              app.title
            )
          );
        })
      );
    }
  }]);

  return Taskbar;
}(_ponnie2.default.Component);

exports.default = Taskbar;

},{"ponnie":2}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ponnie = require('ponnie');

var _ponnie2 = _interopRequireDefault(_ponnie);

var _file = require('./file');

var _file2 = _interopRequireDefault(_file);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_ponnie2.default.register('file', _file2.default);

var FileBrowser = function (_ponnie$Component) {
  _inherits(FileBrowser, _ponnie$Component);

  function FileBrowser() {
    _classCallCheck(this, FileBrowser);

    var rand = Math.floor(Math.random() * 5);
    var dirs = [];
    var files = [];
    for (var i = 0; i < rand; i++) {
      dirs.push({
        name: 'My directory'
      });
    }

    rand = Math.floor(Math.random() * 20);
    for (var _i = 0; _i < rand; _i++) {
      files.push({
        name: 'My file'
      });
    }

    return _possibleConstructorReturn(this, (FileBrowser.__proto__ || Object.getPrototypeOf(FileBrowser)).call(this, {
      dirs: dirs,
      files: files
    }));
  }

  _createClass(FileBrowser, [{
    key: 'render',
    value: function render() {
      return _ponnie2.default.vnode(
        'div',
        { 'class': 'file-browser' },
        _ponnie2.default.vnode(
          'div',
          { 'class': 'file-browser-items' },
          this.data.dirs.map(function (dir) {
            return _ponnie2.default.vnode(
              'div',
              { 'class': 'file-browser-dir' },
              dir.name
            );
          }),
          this.data.files.map(function (file) {
            return _ponnie2.default.vnode('file', { name: file.name });
          })
        )
      );
    }
  }]);

  return FileBrowser;
}(_ponnie2.default.Component);

exports.default = FileBrowser;

},{"./file":10,"ponnie":2}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ponnie = require('ponnie');

var _ponnie2 = _interopRequireDefault(_ponnie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var File = function (_ponnie$Component) {
  _inherits(File, _ponnie$Component);

  function File() {
    _classCallCheck(this, File);

    return _possibleConstructorReturn(this, (File.__proto__ || Object.getPrototypeOf(File)).call(this, {
      name: 'My file',
      size: '50kb',
      type: 'JPEG-image',
      isSelect: false
    }));
  }

  _createClass(File, [{
    key: 'toggle',
    value: function toggle(e) {
      if (e.detail > 1) {
        return;
      }

      this.update({
        isSelect: !this.data.isSelect
      });
    }
  }, {
    key: 'open',
    value: function open(e) {
      alert('now open' + this.data.name);
      e.stopPropagation();
    }
  }, {
    key: 'render',
    value: function render() {
      return _ponnie2.default.vnode(
        'div',
        { 'class': 'file' + (this.data.isSelect ? ' is-select' : ''), 'p-click': this.toggle, 'p-dblclick': this.open },
        _ponnie2.default.vnode(
          'div',
          { 'class': 'file-name' },
          this.data.name
        ),
        _ponnie2.default.vnode(
          'div',
          { 'class': 'file-type' },
          this.data.type
        ),
        _ponnie2.default.vnode(
          'div',
          { 'class': 'file-size' },
          this.data.size
        )
      );
    }
  }]);

  return File;
}(_ponnie2.default.Component);

exports.default = File;

},{"ponnie":2}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ponnie = require('ponnie');

var _ponnie2 = _interopRequireDefault(_ponnie);

var _fileBrowser = require('../file-browser');

var _fileBrowser2 = _interopRequireDefault(_fileBrowser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_ponnie2.default.register('file-browser', _fileBrowser2.default);

var Manager = function (_ponnie$Component) {
  _inherits(Manager, _ponnie$Component);

  function Manager() {
    _classCallCheck(this, Manager);

    var rand = Math.floor(Math.random() * 5);
    var dirs = [];
    var files = [];
    for (var i = 0; i < rand; i++) {
      dirs.push({
        name: 'My directory'
      });
    }

    rand = Math.floor(Math.random() * 20);
    for (var _i = 0; _i < rand; _i++) {
      files.push({
        name: 'My file'
      });
    }

    return _possibleConstructorReturn(this, (Manager.__proto__ || Object.getPrototypeOf(Manager)).call(this, {
      dirs: dirs,
      files: files
    }));
  }

  _createClass(Manager, [{
    key: 'render',
    value: function render() {
      return _ponnie2.default.vnode(
        'div',
        { 'class': 'media-manager' },
        _ponnie2.default.vnode('file-browser', null)
      );
    }
  }]);

  return Manager;
}(_ponnie2.default.Component);

exports.default = Manager;

},{"../file-browser":9,"ponnie":2}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ponnie = require('ponnie');

var _ponnie2 = _interopRequireDefault(_ponnie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoginScreen = function (_ponnie$Component) {
  _inherits(LoginScreen, _ponnie$Component);

  function LoginScreen() {
    _classCallCheck(this, LoginScreen);

    return _possibleConstructorReturn(this, (LoginScreen.__proto__ || Object.getPrototypeOf(LoginScreen)).call(this, {
      isLoading: false
    }));
  }

  _createClass(LoginScreen, [{
    key: 'login',
    value: function login() {
      var _this2 = this;

      this.update({
        isLoading: true
      });

      setTimeout(function () {
        _this2.trigger('login');
      }, 1000);
    }
  }, {
    key: 'render',
    value: function render() {
      return _ponnie2.default.vnode(
        'div',
        { 'class': 'login-screen' + (this.data.isLoading ? ' is-loading' : '') },
        _ponnie2.default.vnode(
          'div',
          { 'class': 'login-screen-widget' },
          _ponnie2.default.vnode(
            'div',
            { 'class': 'login-screen-title' },
            'Bolster.'
          ),
          _ponnie2.default.vnode(
            'div',
            null,
            'Bonjour, this is a demo login screen, just some temporary shizzle. Just press the button below to get to your desktop.'
          ),
          _ponnie2.default.vnode(
            'button',
            { 'p-click': this.login, 'class': 'login-screen-button' },
            'Login'
          )
        )
      );
    }
  }]);

  return LoginScreen;
}(_ponnie2.default.Component);

exports.default = LoginScreen;

},{"ponnie":2}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ponnie = require('ponnie');

var _ponnie2 = _interopRequireDefault(_ponnie);

var _desktop = require('../desktop/desktop');

var _desktop2 = _interopRequireDefault(_desktop);

var _loginScreen = require('./login-screen');

var _loginScreen2 = _interopRequireDefault(_loginScreen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

_ponnie2.default.register('desktop', _desktop2.default);
_ponnie2.default.register('login-screen', _loginScreen2.default);

var Root = function (_ponnie$Component) {
  _inherits(Root, _ponnie$Component);

  function Root() {
    _classCallCheck(this, Root);

    return _possibleConstructorReturn(this, (Root.__proto__ || Object.getPrototypeOf(Root)).call(this, {
      isLoggedIn: false
    }));
  }

  _createClass(Root, [{
    key: 'login',
    value: function login() {

      this.update({
        isLoggedIn: true
      });
    }
  }, {
    key: 'render',
    value: function render() {

      if (!this.data.isLoggedIn) {
        return _ponnie2.default.vnode('login-screen', { 'p-login': this.login });
      }

      return _ponnie2.default.vnode('desktop', null);
    }
  }]);

  return Root;
}(_ponnie2.default.Component);

exports.default = Root;

},{"../desktop/desktop":7,"./login-screen":12,"ponnie":2}],14:[function(require,module,exports){
"use strict";

var _ponnie = require('ponnie');

var _ponnie2 = _interopRequireDefault(_ponnie);

var _root = require('./components/os/root');

var _root2 = _interopRequireDefault(_root);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_ponnie2.default.mount(new _root2.default(), document.body);

},{"./components/os/root":13,"ponnie":2}]},{},[14]);
