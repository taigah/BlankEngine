(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

const Game = require('../../index').Game
      , GameState = require('./src/states/gamestate')

window['game'] = new Game('canvas', 500, 500, GameState)
document.querySelector('#reset').addEventListener('click', () => {
  window['game'].resetState()
})

},{"../../index":4,"./src/states/gamestate":2}],2:[function(require,module,exports){
const State = require('../../../../index').State

class GameState extends State
{
  create() {
    super.create()

    let helperText = new createjs.Text('Press P to pause\nPress O to open a dialog box', '16px Arial', '#FFF')
    helperText.x = 50
    helperText.y = 50
    helperText.textBaseline = 'alphabetic'

    var circle = new createjs.Shape()
    circle.graphics.beginFill("Crimson").drawCircle(0, 0, 50)
    circle.x = 250
    circle.y = 250
    this.add(circle)

    let circleAnimation = createjs.Tween.get(circle, {loop: true})
      .to({x: 450}, 1000, createjs.Ease.getPowInOut(4))
      .to({alpha: 0, x: 0}, 500, createjs.Ease.getPowInOut(2))
      .to({alpha: 0, x: 550}, 100)
      .to({alpha: 1, x: 250}, 500, createjs.Ease.getPowInOut(2))
    this.addAnimation(circleAnimation)

    this.add(helperText)

    this.eventHandler = (e) => {
      this.onKeyPress(e)
    }

    document.addEventListener('keypress', this.eventHandler)
  }

  update(e) {
    super.update(e)
  }

  destroy() {
    super.destroy()
    document.removeEventListener('keypress', this.eventHandler)
  }

  openPauseMenu() {
    this.openSubstate(require('./pausemenustate'))
    this.frozen = true
  }

  openDialogBox() {
    console.log('open dialog')
  }

  onKeyPress(e) {
    switch(e.keyCode) {
      case 112: // P
        this.openPauseMenu()
        break
      case 111: // O
        this.openDialogBox()
        break
    }
  }
}

module.exports = GameState

},{"../../../../index":4,"./pausemenustate":3}],3:[function(require,module,exports){
const State = require('../../../../index').State

class PauseMenuState extends State
{
  create() {
    super.create()
    let helperText = new createjs.Text('Press P to pause\nPress O to open a dialog box', '99px Arial', '#FFF')
    helperText.x = 50
    helperText.y = 50
    helperText.textBaseline = 'alphabetic'

    this.add(helperText)
  }

  update(e) {
    super.update(e)
  }
}

module.exports = PauseMenuState

},{"../../../../index":4}],4:[function(require,module,exports){
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

},{"./src/entity":5,"./src/game":6,"./src/state":7}],5:[function(require,module,exports){
'use strict'

class Entity
{
  constructor(...params) {
    this.children = {}
    this.entities = {}
    this.animations = {}
    this.childrenIncrement = 0
    this.entitiesIncrement = 0
    this.animationsIncrement = 0
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
   * Adds an animation
   * @param {Object} animation
   * @param {String} name
   */
  addAnimation(animation, name) {
    id = id || ++this.childrenIncrement // Generating id if no id was passed to the function

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

},{"./state":7}],6:[function(require,module,exports){
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

},{"./entity":5}],7:[function(require,module,exports){
'use strict'

const Entity = require('./entity')

class State extends Entity
{
  create() {
    super.create()
    this.substatesIncrement = 0
  }

  /**
   * Opens a substate
   * @param  {State} state
   * @param  {String} id
   * @param  {Mixed} ...params
   */
  openSubstate(state, id, ...params) {
    id = id || 'Substate'+(++this.substatesIncrement)
    this.add(new state(...params), id)
  }
}

module.exports = State

},{"./entity":5}]},{},[1]);
