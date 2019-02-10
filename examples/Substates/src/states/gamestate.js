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
