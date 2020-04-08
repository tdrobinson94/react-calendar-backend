'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EventSchema extends Schema {
  up () {
    this.create('events', (table) => {
      table.increments()
      table.integer('user_id')
      table.integer('item_type')
      table.string('title')
      table.integer('frequency')
      table.text('description')
      table.date('start_date')
      table.date('end_date')
      table.time('start_time')
      table.time('end_time')
      table.string('location')
      table.timestamps()
    })
  }

  down () {
    this.drop('events')
  }
}

module.exports = EventSchema
