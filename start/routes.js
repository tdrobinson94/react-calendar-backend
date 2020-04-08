'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})
Route.post('/signup', 'UserController.store')
Route.get('/users', 'UserController.index')
Route.get('/user', 'UserController.show').middleware('auth')
Route.get('/userid', 'UserController.showId').middleware('auth')
Route.patch('/updateuser', 'UserController.update').middleware('auth')
Route.delete('/deleteuser', 'UserController.destroy').middleware('auth')
Route.post('/event', 'EventController.store').middleware('auth')
Route.get('/user/events', 'EventController.index').middleware('auth')
Route.delete('/deleteevent/:id', 'EventController.destroy')
Route.post('/login', 'UserController.login')
