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
    let forecast_year = moment(input.start_date).format('Y');
    let forecast_month = moment(input.start_date).format('M');
    let forecast_day = moment(input.start_date).format('D');

    forecastStartDate = forecast_year.toString() + forecast_month.toString() + forecast_day.toString();

    if (input.frequency === 365) {
      for (var forecast_date = moment(forecastStartDate); forecast_date.isBefore(input.end_date); forecast_year.add(1, 'years')) {
        console.log(forecast_date.format('YYYY-MM-DD'))
        var newEvent = await Event.create({
          user_id: auth.user.id,
          group_id: input.group_id,
          item_type: input.item_type,
          title: input.title,
          frequency: input.frequency,
          description: input.description,
          start_date: forecast_date.format('YYYY-MM-DD'),
          end_date: forecast_date.format('YYYY-MM-DD'),
          start_time: input.start_time,
          end_time: input.end_time,
          location: input.location
        })
      }
    } else {
      for (var forecast_date = moment(input.start_date); forecast_date.isBefore(input.end_date); forecast_date.add(input.frequency, 'days')) {
        console.log(forecast_date.format('YYYY-MM-DD'))
        var newEvent = await Event.create({
          user_id: auth.user.id,
          group_id: input.group_id,
          item_type: input.item_type,
          title: input.title,
          frequency: input.frequency,
          description: input.description,
          start_date: forecast_date.format('YYYY-MM-DD'),
          end_date: forecast_date.format('YYYY-MM-DD'),
          start_time: input.start_time,
          end_time: input.end_time,
          location: input.location
        })
      }
    }

    return response.json(newEvent.toJSON())
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

  async destroyGroup({ request, response }) {
    const input = request.post('group_id')

    const events = await Event.findBy('group_id', input.group_id)

    await events.delete()

    response.json({
      message: 'Group was successfully deleted',
      input
    })
  }
}

module.exports = EventController
