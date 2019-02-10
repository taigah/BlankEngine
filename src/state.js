'use strict'

const Entity = require('./entity')

class State extends Entity
{
  create() {
    super.create()
    this.substatesIncrement = 0
  }

  /**
   * Opens a substate
   * @param  {State} state
   * @param  {String} id
   * @param  {Mixed} ...params
   */
  openSubstate(state, id, ...params) {
    id = id || 'Substate'+(++this.substatesIncrement)
    this.add(new state(...params), id)
  }
}

module.exports = State
