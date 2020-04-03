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
      // let token = await auth.generate(user)

      // Object.assign(newUser, token)

      response.status(201).json(newUser.toJSON())
    }
  }

  async login ({ request, response, auth, params: { id } }) {
    const input = request.only(['username', 'password'])

    // try {
    //   if (await auth.attempt(input)) {
    //     const user = await User.findBy('username', input.username)
    //     let token = await auth.generate(user)

    //     Object.assign(user, token)
    //     return response.status(201).json(user.toJSON())
    //   }
    // } catch(e) {
    //   console.log(e)
    //   return response.status(204).json({message: 'You are not registered!'})
    // }

    try {
      const user = await User.findBy('username', input.username)
      const verify = await Hash.verify(input.password, user.password)

     if (!verify) {
        return response.json({
          message: 'Could not verify user',
        })
      } 

      return response.status(201).json(user.toJSON())

    } catch (e) {
      return response.status(204).json({ error: e.message })
    }
  }



  async show({ request, response, params: { id } }) {
    const user = await User.find(id)

    response.status(200).json([user.toJSON()])
    // response.status(200).json({
    //   message: 'Here is your user',
    //   data: user
    // })
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
    // const input = request.only('username', 'password')
    // input.id = request.authUser.id;

    // const user = User.findBy('id', request.param('id'))

    await user.delete()

    response.json({
      message: 'Successfully deleted this user',
      id
    })
  }
}

module.exports = UserController
