'use strict'

let BlankEngine = {
  Game: require('./src/game')
  , State: require('./src/state')
  , Entity: require('./src/entity')
}

// NodeJS
if (module) module.exports = BlankEngine

// Browser
if (window) {
  window['BlankEngine'] = BlankEngine
  for (var i in BlankEngine) {
    window[i] = BlankEngine[i]
  }
}
