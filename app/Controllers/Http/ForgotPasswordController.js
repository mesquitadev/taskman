'use strict'
const User = use('App/Models/User')
const Mail = use('Mail')
const crypto = require('crypto')
const moment = require('moment')
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with forgotpasswords
 */
class ForgotPasswordController {
  /**
   * Create/save a new forgotpassword.
   * POST forgotpasswords
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    try {
      const email = request.input('email')
      const user = await User.findByOrFail('email', email)

      user.token = crypto.randomBytes(10).toString('hex')
      user.token_created_at = new Date()
      await user.save()

      await Mail.send(
        ['emails.forgot'],
        { email, token: user.token, link: `${request.input('redirect_url')}?token=${user.token}` },
        message => {
          message
            .to(user.email)
            .from('mesquita@oka.com', 'Victor')
            .subject('Recuperacao de Senha')
        }
      )
    } catch (err) {
      return response.status(err.status).send({
        error: {
          message: err.message,
          genericMessage: 'Erro na Atualizacao da Senha, favor, verifique os dados Inseridos.'
        }
      })
    }
  }

  /**
   * Update User Password details.
   * PUT or PATCH forgotpasswords/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    try {
      const { token, password } = request.all()
      const user = await User.findByOfFail('token', token)
      const tokenExpired = moment().subtract('2', 'days').isAfter(user.token_created_at)

      if (tokenExpired) {
        return response.status(401).send({
          error: {
            message: 'O token de Recuperacao Expirou!'
          }
        })
      }

      user.token = null
      user.token_created_at = null
      user.password = password
      await user.save()
    } catch (err) {
      return response.status(err.status).send({
        error: {
          message: err.message
        }
      })
    }
  }

  /**
   * Delete a forgotpassword with id.
   * DELETE forgotpasswords/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = ForgotPasswordController
