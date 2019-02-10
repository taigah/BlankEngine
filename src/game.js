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
