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
