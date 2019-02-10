(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

const Game = require('../../index').Game
      , GameState = require('./src/states/gamestate')

window['game'] = new Game('canvas', 500, 500, GameState)
document.querySelector('#reset').addEventListener('click', () => {
  window['game'].resetState()
})

},{"../../index":3,"./src/states/gamestate":2}],2:[function(require,module,exports){
const State = require('../../../../index').State

class GameState extends State
{
  create() {
    super.create()

    let mousePosText = new createjs.Text('x: 0\ny: 0', '32px Arial', '#FFF')
    mousePosText.x = 230
    mousePosText.y = 230
    mousePosText.textBaseline = 'alphabetic'

    this.add(mousePosText, 'MousePosText')
  }

  update(e) {
    super.update(e)
    this.updatePosText(this.mousepos.x, this.mousepos.y)
  }

  updatePosText(x, y) {
    this.getEntity('MousePosText').text = 'x: '+x+'\ny: '+y
  }
}

module.exports = GameState

},{"../../../../index":3}],3:[function(require,module,exports){
'use strict'

let BlankEngine = {
  Game: require('./src/game')
  , State: require('./src/state')
  , Entity: require('./src/entity')
}

// NodeJS
if (module) module.exports = BlankEngine

// Browser
if (window) {
  window['BlankEngine'] = BlankEngine
  for (var i in BlankEngine) {
    window[i] = BlankEngine[i]
  }
}

},{"./src/entity":4,"./src/game":5,"./src/state":6}],4:[function(require,module,exports){
'use strict'

class Entity
{
  constructor(...params) {
    this.children = {}
    this.entities = {}
    this.childrenIncrement = 0
    this.entitiesIncrement = 0
    this.frozen = false
    this.params = params
  }

  /**
   * The function called when the entity was successfuly added to his parent
   * @param  {Mixed} ...params
   */
  create(...params) { }

  /**
   * A function called every frame and updating every children objects
   * @param  {Object} e event delegate by createJS tick event listener
   */
  update(e) {
    for (let i in this.children) {
      if (!this.children[i].frozen) {
        this.children[i].update(e)
      }
    }
  }

  /**
   * Adds an entity (createJS shape) or a child (an instance of Entity)
   * @param {Object} entity a createJS shape or an instance of Entity
   * @param {String} id
   */
  add(entity, id) {
    // If the entity is a createJS shape
    if (!(entity instanceof Entity)) {
      id = id || ++this.entitiesIncrement
      this.stage.addChild(entity)
      this.entities[id] = entity
      return
    }

    entity.id = id || ++this.childrenIncrement // Generating id if no id was passed to the function

    if (this.children[entity.id] !== undefined) {
      throw new Error('Id already taken')
    }

    // Setting global references
    entity.game = this.game
    entity.mousepos = this.mousepos
    entity.stage = this.stage
    entity.parent = this
    if (this.state && !this.state.prototype instanceof require('./state') || this instanceof require('./state')) {
      entity.state = this.state || this // References to the current State
    }

    entity.create(...entity.params)
    this.children[entity.id] = entity
  }

  /**
   * Destroys the Entity
   */
  destroy() {
    // Destroying entity's children
    for (let i in this.children) {
      this.children[i].destroy()
    }
    // Destroying entity's createJS shape
    for (let i in this.entities) {
      this.stage.removeChild(this.entities[i])
    }
    // Deleting entity from parent array
    delete this.parent.children[this.id]
  }

  /**
   * Retrieves a child
   * @param  {String} id
   */
  getChild(id) {
    return this.children[id]
  }

  /**
   * Retrieves an entity
   * @param  {String} id
   */
  getEntity(id) {
    return this.entities[id]
  }
}

module.exports = Entity

},{"./state":6}],5:[function(require,module,exports){
'use strict'

const Entity = require('./entity')

class Game extends Entity
{
  /**
   * Game's contructor
   * @param  {String} canvasId
   * @param  {Number} width     width of the canvas
   * @param  {Number} height    height of the canvas
   * @param  {State} state      first state to load
   */
  constructor(canvasId, width, height, state) {
    super()

    this.stage = new createjs.Stage(canvasId)
    this.stage.width = width
    this.stage.height = height
    this.game = this
    createjs.Ticker.setFPS(60)
    createjs.Ticker.addEventListener('tick', this.stage)
    createjs.Ticker.addEventListener('tick', (e) => this.update(e))

    document.addEventListener('mousemove', (e) => {
      let rect = this.stage.canvas.getBoundingClientRect()
      this.mousepos.x = e.clientX - rect.left
      this.mousepos.y = e.clientY - rect.top
    })

    this.mousepos = { x: this.stage.width / 2, y: this.stage.height / 2 }

    this.state = null
    this.substate = null

    this.switchState(state)
  }

  /**
   * Adds a state
   * @param {State} state
   * @param {Mixed} ...params
   */
  addState(state, ...params) {
    this.state = state
    this.add(new this.state(...params), 'state')
  }

  /**
   * Destroys the current state
   */
  destroyState() {
    if (this.state !== null) {
      this.getChild('state').destroy()
    }
  }

  /**
   * Switches to another state
   * @param  {State} state
   * @param  {Mixed} ...params
   */
  switchState(state, ...params) {
    this.destroyState()
    this.addState(state, ...params)
  }

  /**
   * Resets current state
   */
  resetState() {
    this.destroyState()
    this.addState(this.state)
  }
}

module.exports = Game

},{"./entity":4}],6:[function(require,module,exports){
'use strict'

const Entity = require('./entity')

class State extends Entity
{
  
}

module.exports = State

},{"./entity":4}]},{},[1]);
