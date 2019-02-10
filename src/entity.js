'use strict'

class Entity
{
  constructor(...params) {
    this.children = {}
    this.entities = {}
    this.animations = {}
    this.childrenIncrement = 0
    this.entitiesIncrement = 0
    this.animationsIncrement = 0
    this.frozen = false
    this.params = params
  }

  /**
   * The function called when the entity was successfuly added to his parent
   * @param  {Mixed} ...params
   */
  create(...params) { }

  /**
   * A function called every frame and updating every children objects
   * @param  {Object} e event delegate by createJS tick event listener
   */
  update(e) {
    for (let i in this.children) {
      if (!this.children[i].frozen) {
        this.children[i].update(e)
      }
    }
  }

  /**
   * Adds an entity (createJS shape) or a child (an instance of Entity)
   * @param {Object} entity a createJS shape or an instance of Entity
   * @param {String} id
   */
  add(entity, id) {
    // If the entity is a createJS shape
    if (!(entity instanceof Entity)) {
      id = id || ++this.entitiesIncrement
      this.stage.addChild(entity)
      this.entities[id] = entity
      return
    }

    entity.id = id || ++this.childrenIncrement // Generating id if no id was passed to the function

    if (this.children[entity.id] !== undefined) {
      throw new Error('Id already taken')
    }

    // Setting global references
    entity.game = this.game
    entity.mousepos = this.mousepos
    entity.stage = this.stage
    entity.parent = this
    if (this.state && !this.state.prototype instanceof require('./state') || this instanceof require('./state')) {
      entity.state = this.state || this // References to the current State
    }

    entity.create(...entity.params)
    this.children[entity.id] = entity
  }

  /**
   * Adds an animation
   * @param {Object} animation
   * @param {String} name
   */
  addAnimation(animation, name) {
    id = id || ++this.childrenIncrement // Generating id if no id was passed to the function

  }

  /**
   * Destroys the Entity
   */
  destroy() {
    // Destroying entity's children
    for (let i in this.children) {
      this.children[i].destroy()
    }
    // Destroying entity's createJS shape
    for (let i in this.entities) {
      this.stage.removeChild(this.entities[i])
    }
    // Deleting entity from parent array
    delete this.parent.children[this.id]
  }

  /**
   * Retrieves a child
   * @param  {String} id
   */
  getChild(id) {
    return this.children[id]
  }

  /**
   * Retrieves an entity
   * @param  {String} id
   */
  getEntity(id) {
    return this.entities[id]
  }
}

module.exports = Entity
