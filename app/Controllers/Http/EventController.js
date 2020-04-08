'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with events
 */
class EventController {
  async index({ request, response }) {
    const input = request.only('user_id')

    const events = await Event.query().where('user_id', input.user_id).fetch()

    response.status(200).json(events.toJSON())
  }

  async store({ auth, response }) {
    const input = request.only(['item_type', 'title', 'frequency', 'description', 'start_date', 'end_date', 'start_time', 'end_time', 'location'])

    const theUser = auth.loginViaId(1)
    input.user_id = theUser

    const newEvent = await Event.create(input)

    return response.json(newEvent.toJSON())
  }

  async show({ auth }) {
    
  }

  async update({ auth, request, response, params: { id } }) {


  }

  async destroy({ auth, request, response, params: { id } }) {
    const input = request.only('id')

    input.user_id = auth.getUser().id

    const event = await Event.findBy('id', request.param('id'));

    await event.delete();

    response.json({
      message: 'Successfully deleted this event',
      id
    })

  }
}

module.exports = EventController
