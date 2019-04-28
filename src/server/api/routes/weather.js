//require('es6-promise').polyfill()
import jsonResponseHandler from '../../jsonResponseHandler'
import fetch from 'isomorphic-fetch'
import slackPost from '../data/slack'
import default_config from '../../config'
import finish from './done'
import errorHandlerModule from './errorHandler'

module.exports = async (req, res, done) => {
  var config = req.config
  if (typeof config === 'undefined') {
    config = default_config
  }
  var slack = req.slack
  if (typeof slack == 'undefined') {
    slack = slackPost(config.slackUrl)
  }
  const errorHandler = errorHandlerModule(slack)
  if (config.openweathermap_key !== '') {
    try {
      const fetchResult = await fetch(
        config.weatherUrl + '?zip=' + config.zipCode + ',us&units=imperial&APPID=' + config.openweathermap_key
      )
      const jsonResult = await jsonResponseHandler(fetchResult)

      res.json(jsonResult)
      res.status(200)
      finish(done)
    } catch (err) {
      errorHandler(req, res, done)(err)
    }
  } else {
    const err = 'weather api key not found in configuration'
    errorHandler(req, res, done)(err)
  }
}
