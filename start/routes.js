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
Route.post('/login', 'UserController.login')
Route.get('/users', 'UserController.index')
Route.get('/user', 'UserController.show').middleware('auth')
Route.get('/userid', 'UserController.showId').middleware('auth')
Route.patch('/updateuser', 'UserController.update').middleware('auth')
Route.delete('/deleteuser', 'UserController.destroy').middleware('auth')
Route.post('/event', 'EventController.store').middleware('auth')
Route.post('/events', 'EventController.store_multiple').middleware('auth')
Route.get('/user/events', 'EventController.index')
Route.get('/user/event/:id', 'EventController.show')
Route.delete('/delete/event/:id', 'EventController.destroy')
Route.delete('/deletegroup/event/:id', 'EventController.destroyGroup')
Route.post('/update/event/:id', 'EventController.update')
