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
