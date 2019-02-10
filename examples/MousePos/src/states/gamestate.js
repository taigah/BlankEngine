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
