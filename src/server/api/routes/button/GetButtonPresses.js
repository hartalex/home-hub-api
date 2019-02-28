import jsonResponsePromise from '../../../jsonResponsePromise'
const config = require('../../../config')
const slack = require('../../data/slack')(config.slackUrl)
const errorHandler = require('../errorHandler')(slack)
import { getButtonCount } from '../../button.js'

module.exports = function (req, res, done) {
  let dbobj = req.db
  return getButtonCount(dbobj).then(jsonResponsePromise(res, done)).catch(errorHandler(req, res, done))
}
