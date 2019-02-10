'use strict'

const Game = require('../../index').Game
      , GameState = require('./src/states/gamestate')

window['game'] = new Game('canvas', 500, 500, GameState)
document.querySelector('#reset').addEventListener('click', () => {
  window['game'].resetState()
})
