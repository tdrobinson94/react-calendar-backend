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

  async store_multiple({ auth, request, response }) {
    const input = request.collect(['user_id', 'item_type', 'title', 'frequency', 'description', 'start_date', 'end_date', 'start_time', 'end_time', 'location'])

    input.user_id = auth.user.id
    input.group_id += 1

    const newEvent = await Event.createMany(input)

    return response.json(newEvent)
  }

  async show({ request, response }) {
    const input = request.only('id')

    const event = await Event.findBy('id', input.id);

    return response.json(event.toJSON())
  }

  async update({ request, response, params: { id } }) {
    const input = request.only('id')
    const event = await Event.findBy('id', input.id)
    const { title, frequency, description, start_date, end_date, start_time, end_time, location } = request.post()

    event.title = title
    event.frequency = frequency
    event.description = description
    event.start_date = start_date
    event.end_date = end_date
    event.start_time = start_time
    event.end_time = end_time
    event.location = location

    await event.save()

    response.status(200).json({
      message: 'Successfully updated an event',
      data: event
    })

  }

  async destroy({ request, response }) {
    const input = request.only('id')

    const event = await Event.findBy('id', input.id)

    await event.delete()

    response.json({
      message: 'Successfully deleted this event',
      input
    })

  }
}

module.exports = EventController
