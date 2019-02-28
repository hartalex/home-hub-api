var expressWinston = require('express-winston')
var express = require('express')
var apiRoutes = require('./api/routes/routes')
const http = require('http')
const cors = require('cors')
const winston = require('winston')
const app = express()
const server = http.Server(app)
const io = require('socket.io')(server)

const logging = new winston.Logger({
  transports: [new winston.transports.Console({ timestamp: true })]
})
app.use(cors())
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

apiRoutes(app, undefined, io)
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
    server.listen(8080)
  })
  .catch(function (err) {
    logging.log('error', 'server.js', err)
  })
