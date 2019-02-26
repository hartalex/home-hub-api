const cache = require('express-cache-headers')
var expressWinston = require('express-winston')
var winston = require('winston')
var express = require('express')
var apiRoutes = require('./api/routes/routes')
//var fs = require('fs')
//var https = require('https')
var http = require('http')
//var forceSsl = require('express-force-ssl')
//var key = fs.readFileSync('/etc/ssl/private/ssl-hub.hartcode.com.key')
//var cert = fs.readFileSync( '/etc/ssl/certs/ssl-hub.hartcode.com.crt' )
const cors = require('cors')
const logging = new winston.Logger({
  transports: [ new winston.transports.Console({ timestamp: true }) ]
})

var options = {
  //	key: key,
  //	cert: cert
}

const app = express()
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
//app.use(forceSsl)

app.use(cache(300))
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
    //https.createServer(options, app).listen(443)

    http.createServer(app).listen(8220)
  })
  .catch(function (err) {
    logging.log('error', 'server.prod.js', err)
  })
