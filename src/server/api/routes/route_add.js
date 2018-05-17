const slackPost = require('../data/slack')
const configImport = require('../../config')
const logging = require('winston')
const finish = require('./done')

module.exports = function(config, slack) {
  if (typeof config == 'undefined') {
    config = configImport
  }
  if (typeof slack == 'undefined') {
    slack = slackPost(config.slackUrl)
  }
  return function(func, req, res, done) {
  return func.then(function(output) {
    res.status(200)
    res.json(output)
    finish(done)
  }).catch(function(err) {
    logging.log('error', req.method + ' ' + req.url, err)
    slack.SlackPost(err, req).catch(function(slackErr) {
      logging.log('error', 'slack in '+ req.method + ' ' + req.url, slackErr)
    })
    res.status(500)
    res.json({
      result: 'fail',
      reason: err
    })
    finish(done)
  })
}
}
