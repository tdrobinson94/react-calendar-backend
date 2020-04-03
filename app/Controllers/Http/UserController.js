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
      return response.status(422).json(validation.messages());
    } else {
      const newUser = await User.create(input)

      response.status(201).json(newUser.toJSON())
    }
  }

  async login ({ request, response, auth, params: { id } }) {
    const username = request.input('username')
    const password = request.input('password')

    try {
      const user = await User.findBy('username', username)
      const verify = await Hash.verify(password, user.password)

     if (!verify) {
        return response.json({
          message: 'Incorrect password',
        })
      } 
      let token = await auth.generate(user)

      Object.assign(user, token)
      return response.status(201).json(user.toJSON())

    } catch (e) {
      return response.json({
        message: 'Incorrect username',
      })
    }
  }



  async show({ auth, request, response, params }) {
    // const user = request.post().user
    const user = await User.find(id)
    // const auth = request.header('Authorization')
    // return response.json(request.authUser)

    return response.json(user)
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

    response.json({
      message: 'Successfully deleted this user',
      id
    })
  }
}

module.exports = UserController
