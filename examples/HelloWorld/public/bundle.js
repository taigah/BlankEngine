(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'

const Game = require('../../index').Game
      , GameState = require('./src/states/gamestate')

window['game'] = new Game('canvas', 500, 500, GameState)
document.querySelector('#reset').addEventListener('click', () => {
  window['game'].resetState()
})

},{"../../index":8,"./src/states/gamestate":7}],2:[function(require,module,exports){
'use strict'

const Entity = require('../../../index').Entity

class Game extends Entity
{
  create(x, y, size, color) {
    let circle = new createjs.Shape()
    circle.graphics.beginFill(color).drawCircle(0, 0, size)
    circle.x = x
    circle.y = y
    this.add(circle, 'circle')
  }

  getCircle() {
    let circle = this.getEntity('circle')
    return {
      x: circle.x
      , y: circle.y
      , r: this.radius
    }
  }

  collide(circle) {
    let circleA = this.getCircle()
        , circleB = circle.getCircle()
        , distance = Math.sqrt(Math.pow(circleB.x - circleA.x, 2) + Math.pow(circleB.y - circleA.y, 2))
    return distance < circleA.r + circleB.r
  }

  get radius() {
    return this.getEntity('circle').graphics.command.radius
  }

  set radius(r) {
    this.getEntity('circle').graphics.command.radius = r
  }
}

module.exports = Game

},{"../../../index":8}],3:[function(require,module,exports){
'use strict'

const Circle = require('./circle')

class Enemy extends Circle
{
  update(e) {
    super.update()
  }
}

module.exports = Enemy

},{"./circle":2}],4:[function(require,module,exports){
'use strict'

const Enemy = require('./enemy')
      , Entity = require('../../../index').Entity

class EnemyContainer extends Entity
{
  create() {
    this.timer = setInterval(() => this.spawnEnemy(), 1000)
  }

  spawnEnemy() {
    let x = Math.random() * 500
        , y = Math.random() * 500
        , size = Math.random() * 5 + 2
        , enemy = new Enemy(x, y, size, 'red')
    this.add(enemy)
  }

  destroy() {
    super.destroy()
    clearInterval(this.timer)
  }
}

module.exports = EnemyContainer

},{"../../../index":8,"./enemy":3}],5:[function(require,module,exports){
'use strict'

const Circle = require('./circle')

class Player extends Circle
{
  create(...params) {
    super.create(...params)
    this.boosting = false
  }

  update(e) {
    // movement
    let circle = this.getEntity('circle')
        , vec = {
          x: this.mousepos.x - circle.x
          , y: this.mousepos.y - circle.y
        }
        , norm = Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.y, 2))
        , unit = {
          x: vec.x / norm
          , y: vec.y / norm
        }
        , speed = this.getSpeed(e.delta)
        , velocity = {
          x: unit.x * speed || 0
          , y: unit.y * speed || 0
        }
    circle.x += velocity.x
    circle.y += velocity.y

    // enemy collision
    let enemies = this.parent.getChild('EnemyContainer').children
    for (let i in enemies) {
      let enemy = enemies[i]

      if (this.collide(enemy)) {
        this.game.score += enemy.radius | 0
        this.parent.updateScore()
        this.radius += enemy.radius / 10
        enemy.destroy()
      }
    }

    // boost
    if (this.boosting) {
      let loss = 1.5 * e.delta/1000
      if (this.radius - loss < 0) {
        this.state.gameover()
        return
      }
      this.radius -= loss
    }
  }

  getSpeed(delta) {
    return 100 * delta/1000 * (this.boosting ? 2: 1)
  }

  onMouseDown() {
    this.boosting = true
  }

  onMouseUp() {
    this.boosting = false
  }
}

module.exports = Player

},{"./circle":2}],6:[function(require,module,exports){
'use strict'

const State = require('../../../../index').State

class GameOverState extends State
{
  create() {
    let gameOverText = new createjs.Text('Game Over', '64px Arial', '#FFF')
        , scoreText = new createjs.Text('Score: '+this.game.score, '46px Arial', '#FFF')
        , replayText = new createjs.Text('Replay', '46px Arial Underline', '#FFF')
        , bounds = gameOverText.getBounds()
    gameOverText.x = 250 - bounds.width/2
    gameOverText.y = 100

    bounds = scoreText.getBounds()
    scoreText.x = 250 - bounds.width/2
    scoreText.y = 220

    bounds = replayText.getBounds()
    replayText.x = 250 - bounds.width/2
    replayText.y = 320

    let replayHitbox = new createjs.Shape();
    replayHitbox.graphics.beginFill('#000').drawRect(0, 0, replayText.getMeasuredWidth(), replayText.getMeasuredHeight());
    replayText.hitArea = replayHitbox;

    this.add(gameOverText)
    this.add(scoreText)
    this.add(replayText)

    replayText.on('click', () => this.replay())
  }

  replay() {
    this.game.switchState(require('./gamestate'))
  }
}

module.exports = GameOverState

},{"../../../../index":8,"./gamestate":7}],7:[function(require,module,exports){
'use strict'

const State = require('../../../../index').State
      , Player = require('../player')
      , EnemyContainer = require('../enemycontainer.js')
      , GameOverState = require('./gameoverstate.js')

class GameState extends State
{
  create() {
    this.game.score = 0

    let player = new Player(250, 250, 10, 'blue')
    this.add(player, 'Player')
    this.add(new EnemyContainer(), 'EnemyContainer')

    this.stage.on('stagemousedown', () => player.onMouseDown())
    this.stage.on('stagemouseup', () => player.onMouseUp())

    let scoreText = new createjs.Text('Score: 0', '16px Arial', '#FFF')
    this.add(scoreText, 'score')
    this.updateScore()
  }

  update(e) {
    super.update(e)
    this.stage.setChildIndex(this.getEntity('score'), this.stage.getNumChildren()-1);
    this.getEntity('score').scoreText = 'Score: 500000'
  }

  updateScore() {
    let scoreText = this.getEntity('score')
        , bounds = scoreText.getBounds()
    scoreText.text = 'Score: '+this.game.score
    scoreText.x = 250 - bounds.width/2
    scoreText.y = 10
  }

  gameover() {
    this.game.switchState(GameOverState)
  }
}

module.exports = GameState

},{"../../../../index":8,"../enemycontainer.js":4,"../player":5,"./gameoverstate.js":6}],8:[function(require,module,exports){
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

},{"./src/entity":9,"./src/game":10,"./src/state":11}],9:[function(require,module,exports){
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

},{"./state":11}],10:[function(require,module,exports){
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

},{"./entity":9}],11:[function(require,module,exports){
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

},{"./entity":9}]},{},[1]);
