const State = require('../../../../index').State

class PauseMenuState extends State
{
  create() {
    super.create()
    let helperText = new createjs.Text('Press P to pause\nPress O to open a dialog box', '99px Arial', '#FFF')
    helperText.x = 50
    helperText.y = 50
    helperText.textBaseline = 'alphabetic'

    this.add(helperText)
  }

  update(e) {
    super.update(e)
  }
}

module.exports = PauseMenuState
