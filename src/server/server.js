import path from 'path'
var expressWinston = require('express-winston')
var express = require('express')
var apiRoutes = require('./api/routes/routes')
const winston = require('winston')
const app = express()

const logging = new winston.Logger({
  transports: [ new winston.transports.Console({ timestamp: true }) ]
})

app.use(
  expressWinston.logger({
    transports: [
      new winston.transports.Console({
        msg: 'HTTP {{req.method}} {{req.url}}',
        colorize: true,
        timestamp: true
      })
    ]
  })
)

apiRoutes(app)
  .then(function () {
    app.use(
      expressWinston.errorLogger({
        transports: [
          new winston.transports.Console({
            json: true,
            colorize: true,
            timestamp: true
          })
        ]
      })
    )
    app.listen(8080)
  })
  .catch(function (err) {
    logging.log('error', 'server.js', err)
  })
