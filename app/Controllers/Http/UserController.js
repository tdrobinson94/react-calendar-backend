'use strict'

const Validator = use('Validator')
const User = use('App/Models/User')
const Hash = use('Hash')

class UserController {
  async index ({ request, response}) {
    const users = await User.all()

    response.status(200).json({
      message: 'Here are your users form index.',
      data: users
    })
  }

  async store ({ request, response, params: { id } }) {
    const input = request.only(['firstname', 'lastname', 'username', 'email', 'password'])

    input.password = await Hash.make(input.password)

    const validation = await Validator.validate(input, User.rules)

    if (validation.fails()) {
      response.json(validation.messages())
      console.log(validation.messages()[3])
      return response.status(400).json(validation.messages());
    } else {
      const user = await User.create(input)

      response.status(201).json({
        message: 'Successfully created a new user.',
        data: user
      })
    }
  }

  async login ({ request, response, params: { id } }) {
    const input = request.only(['username', 'password'])

    try {
      const user = await User.findBy('username', input.username)
      const verify = await Hash.verify(input.password, user.password)

      if (!verify) {
        return response.json({
          message: 'Password Mismatch',
          data: user
        })
      } else {
        return response.json({
          message: 'Password match',
          data: user
        })
      }
    } catch (e) {
      return response.status(204).json({ error: e.message })
    }
  }



  async show({ request, response, params: { id } }) {
    const user = await User.find(id)

    response.status(200).json({
      message: 'Here is your user',
      data: user
    })
  }

  async update ({ request, response, params: { id } }) {
    const user = request.post().user
    const { firstname, lastname, username, password } = request.post()

    user.firstname = firstname
    user.lastname = lastname
    user.username = username
    user.password = password

    await user.save()

    response.status(200).json({
      message: 'Successfully updated a new user',
      data: user
    })
  }

  async destroy ({ request, response, params: { id } }) {
    const user = request.post().user

    await user.delete()

    response.status(200).json({
      message: 'Successfully deleted this user',
      id
    })
  }
}

module.exports = UserController
