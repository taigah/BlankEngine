'use strict'

const Entity = require('./entity')

class Game extends Entity
{
  constructor(canvasId, width, height, state) {
    super()

    this.stage = new createjs.Stage(canvasId)
    this.stage.width = width
    this.stage.height = height
    this.game = this
    createjs.Ticker.setFPS(60)
    createjs.Ticker.addEventListener('tick', this.stage)
    createjs.Ticker.addEventListener('tick', (e) => this.update(e))

    this.stage.on('stagemousemove', (e) => {
      this.mousepos.x = e.stageX
      this.mousepos.y = e.stageY
    })

    this.mousepos = { x: this.stage.width / 2, y: this.stage.height / 2 }

    this.state = null
    this.substate = null

    this.switchState(state)
  }

  update(e) {
    super.update(e)
  }

  addState(state, ...params) {
    this.state = state
    this.add(new this.state(...params), 'state')
  }

  destroyState() {
    if (this.state !== null) {
      this.getChild('state').destroy()
    }
  }

  switchState(state, ...params) {
    console.log(state)
    this.destroyState()
    this.addState(state, ...params)
  }

  resetState() {
    this.destroyState()
    this.addState(this.state)
  }

  destroy() {
    super.destroy()
  }
}

module.exports = Game
