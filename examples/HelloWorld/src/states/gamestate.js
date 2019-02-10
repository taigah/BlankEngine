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
