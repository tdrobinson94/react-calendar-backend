'use strict'

const Event = use('App/Models/Event')
const moment = require('moment')

class EventController {
  async index({ request, response }) {
    const input = request.only('user_id')

    const events = await Event.query().where('user_id', input.user_id).fetch()

    response.status(200).json(events.toJSON())
  }

  async store({ auth, request, response }) {
    const input = request.post(['group_id', 'item_type', 'title', 'frequency', 'description', 'start_date', 'end_date', 'start_time', 'end_time', 'location'])

    input.user_id = auth.user.id
    input.end_date = moment(input.end_date).add(1, 'days')

    for (var forecast_date = moment(input.start_date); forecast_date.isBefore(input.end_date); forecast_date.add(input.frequency, 'days')) {
      console.log(forecast_date.format('YYYY-MM-DD'))

      const date = forecast_date.format('YYYY-MM-DD') 

      var newEvent = await Event.create({
        user_id: auth.user.id,
        group_id: input.group_id,
        item_type: input.item_type,
        title: input.title,
        frequency: input.frequency,
        description: input.description,
        start_date: date,
        end_date: date,
        start_time: input.start_time,
        end_time: input.end_time,
        location: input.location
      })

      return response.json(newEvent.toJSON())
    }
  }

  async store_multiple({ auth, request, response }) {
    const input = request.collect(['user_id', 'group_id', 'item_type', 'title', 'frequency', 'description', 'start_date', 'end_date', 'start_time', 'end_time', 'location'])

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
