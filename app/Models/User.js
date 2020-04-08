'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
  }

  static get hidden() {
    return ['password'];
  }

  static get rules() {
    return {
      username: 'required|unique:users',
      email: 'required|email|unique:users',
      password: 'required',
    }
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  events () {
    return this.hasMany('App/Model/Event')
  }
}

module.exports = User
