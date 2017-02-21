require('es6-promise').polyfill()
require('isomorphic-fetch')
const db = require('../db/mongodb')
const dbUrl = require('../db/url')

module.exports = function (req, res) {
  // Use connect method to connect to the Server
  db.connect(dbUrl, function (err, dbobj) {
    if (err == null) {
      fetch('http://localhost:8811/sensor/list').then(function (response) {
        if (response.status >= 400) {
          throw new Error('Bad response from server')
        }
        return response.json()
      }).then(function (sensorjson) {
        var retval = []
        sensorjson.forEach(function (sensor) {
          db.queryLastData(dbobj, {sensorId: sensor.sensorId}, {utc_timestamp: -1}, 'temperatures', function (temp) {
            temp.sensorName = sensor.name
            retval.push(temp)
          })
        })
        res.json(retval)
      }).catch(function (err) {
        console.log(err)
        res.json([])
      })
      dbobj.close()
    } else {
      console.log('Error connecting to mongo db')
      console.log(err)
      res.json([])
    }
  })
}