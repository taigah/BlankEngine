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
