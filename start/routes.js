'use strict'
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

Route.get('/', ({ response }) => {
  return response.redirect('/api/v1')
})

Route.group(() => {
  Route.get('/', () => {
    return {
      success: `Server running on ${Env.get('HOST')} in port: ${Env.get('PORT')}`
    }
  })

  Route.post('users', 'UserController.store').validator('User')

  Route.post('sessions', 'SessionController.store').validator(['Session'])

  Route.post('forgot', 'ForgotPasswordController.store').validator(['ForgotPassword'])

  Route.put('reset', 'ForgotPasswordController.update').validator(['ResetPassword'])
  Route.post('/files', 'FileController.store')

  Route.get('/files/:id', 'FileController.show').middleware(['auth'])

  Route.resource('projects', 'ProjectController')
    .apiOnly()
    .validator(new Map(
      [
        [
          ['projects.store'],
          ['Project']
        ]
      ]
    )).middleware(['auth']).apiOnly()
  Route.resource('projects.tasks', 'TaskController').apiOnly().validator(new Map(
    [
      [
        ['projects.tasks.store'],
        ['Task']
      ]
    ]
  )).middleware(['auth'])
}).prefix('api/v1')
