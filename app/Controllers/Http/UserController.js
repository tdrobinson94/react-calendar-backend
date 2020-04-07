'use strict'

const Validator = use('Validator')
const User = use('App/Models/User')
const Mail = use('Mail')
const Hash = use('Hash')


class UserController {
  async index ({ request, response}) {
    const users = await User.all()

    response.status(200).json(users.toJSON())
  }

  async store ({ request, response }) {
    const input = request.only(['firstname', 'lastname', 'username', 'email', 'password'])

    input.password = await Hash.make(input.password)

    const validation = await Validator.validate(input, User.rules)

    if (validation.fails()) {
      response.json(validation.messages())
      console.log(validation.messages())
      return response.status(422).json(validation.messages())
    } else {
      const newUser = await User.create(input)

      await Mail.raw('Registration successful! Please confirm your email address.', (message) => {
        message.subject('Please confirm your eail address')
        message.from('angular.mycalapp@gmail.com', 'AngularCal')
        message.to(newUser.email, newUser.firstname)
      })

      return response.status(201).json(newUser.toJSON())
    }
  }

  async login ({ request, response, auth }) {
    const { username, password } = request.only(['username', 'password'])

    try {
      const user = await User.findBy('username', username)
      const verify = await Hash.verify(password, user.password)

     if (!verify) {
        return response.json({
          message: 'Incorrect password',
        })
      } 
      let token = await auth.attempt(username, password)

      Object.assign(user, token)
      return response.status(201).json(user.toJSON())

    } catch (e) {
      return response.json({
        message: 'Incorrect username',
      })
    }
  }



  async show({ auth }) {
    return await auth.getUser()
  }

  async update ({ auth, request, response, params: { id } }) {
    const user = await auth.getUser()
    const { firstname, lastname, username, password } = request.post()

    user.firstname = firstname
    user.lastname = lastname
    user.username = username
    user.password = await Hash.make(password)
    
    await user.save()

    response.status(200).json({
      message: 'Successfully updated a new user',
      data: user
    })
  }

  async destroy ({ auth, request, response, params: { id } }) {
    const user = await auth.getUser()
    // const user = request.post().user

    await user.delete()

    response.json({
      message: 'Successfully deleted this user',
      id
    })
  }
}

module.exports = UserController
