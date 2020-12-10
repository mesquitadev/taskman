'use strict'
/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
const Env = use('Env')

Route.get('/', ({ response }) => {
  return response.redirect('/api')
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

  Route.group(() => {
    Route.post('/files', 'FileController.store')

    Route.get('/files/:id', 'FileController.show')

    Route.resource('projects', 'ProjectController')
      .apiOnly()
      .validator(new Map(
        [
          [
            ['projects.store'],
            ['Project']
          ]
        ]
      ))
    Route.resource('projects.tasks', 'TaskController').apiOnly().validator(new Map(
      [
        [
          ['projects.tasks.store'],
          ['Task']
        ]
      ]
    ))
  }).middleware(['auth'])
}).prefix('api')
