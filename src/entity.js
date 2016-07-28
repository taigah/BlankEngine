'use strict'

class Entity
{
  constructor(...params) {
    this.children = {}
    this.entities = {}
    this.childrenIncrement = 0
    this.entitiesIncrement = 0
    this.params = params
  }

  update(e) {
    for (let i in this.children) {
      this.children[i].update(e)
    }
  }

  add(entity, id) {
    if (!(entity instanceof Entity)) {
      id = id || ++this.entitiesIncrement
      this.stage.addChild(entity)
      this.entities[id] = entity
      return
    }

    entity.id = id || ++this.childrenIncrement

    if (this.children[entity.id] !== undefined) {
      throw new Error('Id already taken')
    }

    entity.game = this.game
    entity.mousepos = this.mousepos
    entity.stage = this.stage
    entity.parent = this
    if (this.state && !this.state.prototype instanceof require('./state') || this instanceof require('./state')) {
      entity.state = this.state || this
    }

    entity.create(...entity.params)
    this.children[entity.id] = entity
  }

  destroy() {
    for (let i in this.children) {
      this.children[i].destroy()
    }
    for (let i in this.entities) {
      this.stage.removeChild(this.entities[i])
    }
    delete this.parent.children[this.id]
  }

  getChild(id) {
    return this.children[id]
  }

  getEntity(id) {
    return this.entities[id]
  }
}

module.exports = Entity
