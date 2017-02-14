var express = require('express');
var routes = require('./routes/routes');
const port = process.env.PORT || 8811;
const app = express();

routes(app);

app.use(express.static(__dirname + '/web/'));

app.listen(port);
