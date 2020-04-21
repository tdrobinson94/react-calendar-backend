'use strict'

const Event = use('App/Models/Event')

class EventController {
  async index({ request, response }) {
    const input = request.only('user_id')

    const events = await Event.query().where('user_id', input.user_id).fetch()

    response.status(200).json(events.toJSON())
  }

  async store({ auth, request, response }) {
    const input = request.only(['item_type', 'title', 'frequency', 'description', 'start_date', 'end_date', 'start_time', 'end_time', 'location'])

    input.user_id = auth.user.id

    const newEvent = await Event.create(input)

    return response.json(newEvent.toJSON())
  }

  async show({ request, response }) {
    const input = request.only('id')

    const event = await Event.findBy('id', input.id);

    return response.json(event.toJSON())
  }

  async update({ auth, request, response, params: { id } }) {


  }

  async destroy({ auth, request, response, params: { id } }) {
    const input = request.only('id')

    input.user_id = auth.user.id
    
    const event = Event.query().where('user_id', input.user_id).findBy('id', input.id)
    // const event = await Event.findBy('id', input.id)

    await event.delete()

    response.json({
      message: 'Successfully deleted this event',
      id
    })

  }
}

module.exports = EventController
