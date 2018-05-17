const logging = require('winston')
logging.level = 'emerg'
require('./client/moonIcons')
require('./client/temperatureColor')
require('./client/util')
require('./client/weekDay')
require('./server/api/db/mongodb')
require('./server/api/data/data')
require('./server/api/data/slack')
require('./server/api/data/validation')
require('./server/api/routes/services/service_list')
require('./server/api/routes/data_add')
require('./server/api/routes/menu_add')
require('./server/api/routes/routes')
require('./server/api/routes/weather')
require('./server/client/routes')
require('./server/api/data/models/temperatureModel')
require('./server/api/data/models/doorModel')
