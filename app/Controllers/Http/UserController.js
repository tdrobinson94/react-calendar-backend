'use strict'

const Validator = use('Validator')
const User = use('App/Models/User')
const Hash = use('Hash')

class UserController {
  async index ({ request, response}) {
    const users = await User.all()

    response.status(200).json(users.toJSON())
  }

  async store ({ request, response, params: { id } }) {
    const input = request.only(['firstname', 'lastname', 'username', 'email', 'password'])

    input.password = await Hash.make(input.password)

    const validation = await Validator.validate(input, User.rules)

    if (validation.fails()) {
      response.json(validation.messages())
      console.log(validation.messages())
      return response.status(400).json(validation.messages());
    } else {
      const newUser = await User.create(input)

      response.status(201).json(newUser.toJSON())
    }
  }

  async login ({ request, response, params: { id } }) {
    const input = request.only(['username', 'password'])

    try {
      const user = await User.findBy('username', input.username)
      const verify = await Hash.verify(input.password, user.password)
      const check = await User.verify(input.username, user.username)

      if (!verify || !check) {
        return response.status(400).json({
          message: 'Could not verify user',
        })
      } else {
        return response.status(201).json(user.toJSON())
      }
    } catch (e) {
      return response.status(204).json({ error: e.message })
    }
  }



  async show({ request, response, params: { id } }) {
    const user = await User.find(id)

    response.status(200).json([user.toJSON()])
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
