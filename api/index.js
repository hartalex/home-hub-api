var express = require('express')
var routes = require('./routes/routes')
const port = process.env.PORT || 80
const app = express()

routes(app)

app.listen(port)
