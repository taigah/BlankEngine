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
