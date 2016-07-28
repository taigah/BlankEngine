"use strict";

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
      }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, l, l.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
    s(r[o]);
  }return s;
})({ 1: [function (require, module, exports) {
    'use strict';

    var BlankEngine = {
      Game: require('./src/game'),
      State: require('./src/state'),
      Entity: require('./src/entity')
    };

    // NodeJS
    if (module) module.exports = BlankEngine;

    // Browser
    if (window) {
      window['BlankEngine'] = BlankEngine;
      for (var i in BlankEngine) {
        window[i] = BlankEngine[i];
      }
    }
  }, { "./src/entity": 2, "./src/game": 3, "./src/state": 4 }], 2: [function (require, module, exports) {
    'use strict';

    var Entity = function () {
      function Entity() {
        _classCallCheck(this, Entity);

        this.children = {};
        this.entities = {};
        this.childrenIncrement = 0;
        this.entitiesIncrement = 0;

        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
          params[_key] = arguments[_key];
        }

        this.params = params;
      }

      _createClass(Entity, [{
        key: "update",
        value: function update(e) {
          for (var i in this.children) {
            this.children[i].update(e);
          }
        }
      }, {
        key: "add",
        value: function add(entity, id) {
          if (!(entity instanceof Entity)) {
            id = id || ++this.entitiesIncrement;
            this.stage.addChild(entity);
            this.entities[id] = entity;
            return;
          }

          entity.id = id || ++this.childrenIncrement;

          if (this.children[entity.id] !== undefined) {
            throw new Error('Id already taken');
          }

          entity.game = this.game;
          entity.mousepos = this.mousepos;
          entity.stage = this.stage;
          entity.parent = this;
          if (this.state && !this.state.prototype instanceof require('./state') || this instanceof require('./state')) {
            entity.state = this.state || this;
          }

          entity.create.apply(entity, _toConsumableArray(entity.params));
          this.children[entity.id] = entity;
        }
      }, {
        key: "destroy",
        value: function destroy() {
          for (var i in this.children) {
            this.children[i].destroy();
          }
          for (var _i in this.entities) {
            this.stage.removeChild(this.entities[_i]);
          }
          delete this.parent.children[this.id];
        }
      }, {
        key: "getChild",
        value: function getChild(id) {
          return this.children[id];
        }
      }, {
        key: "getEntity",
        value: function getEntity(id) {
          return this.entities[id];
        }
      }]);

      return Entity;
    }();

    module.exports = Entity;
  }, { "./state": 4 }], 3: [function (require, module, exports) {
    'use strict';

    var Entity = require('./entity');

    var Game = function (_Entity) {
      _inherits(Game, _Entity);

      function Game(canvasId, width, height, state) {
        _classCallCheck(this, Game);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Game).call(this));

        _this.stage = new createjs.Stage(canvasId);
        _this.stage.width = width;
        _this.stage.height = height;
        _this.game = _this;
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener('tick', _this.stage);
        createjs.Ticker.addEventListener('tick', function (e) {
          return _this.update(e);
        });

        _this.stage.on('stagemousemove', function (e) {
          _this.mousepos.x = e.stageX;
          _this.mousepos.y = e.stageY;
        });

        _this.mousepos = { x: _this.stage.width / 2, y: _this.stage.height / 2 };

        _this.state = null;
        _this.substate = null;

        _this.switchState(state);
        return _this;
      }

      _createClass(Game, [{
        key: "update",
        value: function update(e) {
          _get(Object.getPrototypeOf(Game.prototype), "update", this).call(this, e);
        }
      }, {
        key: "addState",
        value: function addState(state) {
          this.state = state;

          for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            params[_key2 - 1] = arguments[_key2];
          }

          this.add(new (Function.prototype.bind.apply(this.state, [null].concat(params)))(), 'state');
        }
      }, {
        key: "destroyState",
        value: function destroyState() {
          if (this.state !== null) {
            this.getChild('state').destroy();
          }
        }
      }, {
        key: "switchState",
        value: function switchState(state) {
          console.log(state);
          this.destroyState();

          for (var _len3 = arguments.length, params = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
            params[_key3 - 1] = arguments[_key3];
          }

          this.addState.apply(this, [state].concat(params));
        }
      }, {
        key: "resetState",
        value: function resetState() {
          this.destroyState();
          this.addState(this.state);
        }
      }, {
        key: "destroy",
        value: function destroy() {
          _get(Object.getPrototypeOf(Game.prototype), "destroy", this).call(this);
        }
      }]);

      return Game;
    }(Entity);

    module.exports = Game;
  }, { "./entity": 2 }], 4: [function (require, module, exports) {
    'use strict';

    var Entity = require('./entity');

    var State = function (_Entity2) {
      _inherits(State, _Entity2);

      function State() {
        _classCallCheck(this, State);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(State).apply(this, arguments));
      }

      return State;
    }(Entity);

    module.exports = State;
  }, { "./entity": 2 }] }, {}, [1]);