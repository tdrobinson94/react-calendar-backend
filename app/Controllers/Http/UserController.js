'use strict'

const Validator = use('Validator')
const User = use('App/Models/User')
const Hash = use('Hash')

class UserController {
  async index ({ request, response}) {
    const users = await User.all()

    response.status(200).json(users.toJSON())
  }

  async store ({ request, auth, response, params: { id } }) {
    const input = request.only(['firstname', 'lastname', 'username', 'email', 'password'])

    input.password = await Hash.make(input.password)

    const validation = await Validator.validate(input, User.rules)

    if (validation.fails()) {
      response.json(validation.messages())
      console.log(validation.messages())
      return response.status(400).json(validation.messages());
    } else {
      const newUser = await User.create(input)

      let token = await auth.generate(newUser)

      Object.assign(user, token)

      response.status(201).json(newUser.toJSON())
    }
  }

  async login ({ request, response, auth, params: { id } }) {
    const input = request.only(['username', 'password'])

    try {
      const verify = await Hash.verify(input.password, user.password)

      if (await auth.attempt(username, password)) {
        const user = await User.findBy('username', input.username)
        let token = await auth.generate(user)

        Object.assign(user, token)
        return response.json(user.toJSON())
      }

    //  if (!verify) {
    //     return response.json({
    //       message: 'Could not verify user',
    //     })
    //   } else {
    //     return response.status(201).json(user.toJSON())
    //   }
    } catch (e) {
      return response.status(204).json({ error: e.message })
    }
  }



  async show({ request, response, params: { id } }) {
    const user = request.post().user

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
