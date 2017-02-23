const db = require('../db/mongodb')
const dbUrl = require('../db/url')

module.exports = function (req, res) {
  // Use connect method to connect to the Server
  var connectPromise = db.connect(dbUrl)
  connectPromise.then(function (dbobj) {
    return new Promise(function (resolve, reject) {
      db.querydistinctData(dbobj, 'sensorId', 'temperatures', function (temps) {
        console.log('temps:')
        console.log(temps)
        db.queryData(dbobj, {}, 'sensors', function (sensors) {
          console.log('sensors:')
          console.log(sensors)
          var array = []
          for (var i = 0; i < temps.length; i++) {
            var obj = {
              sensorId: temps[i]
            }
            for (var s = 0; s < sensors.length; s++) {
              if (temps[i] === sensors[s].sensorId) {
                obj.name = sensors[s].name
              }
            }
            array.push(obj)
          }
          dbobj.close()
          resolve(array)
        })
      })
    })
  }).then(function (result) {
    res.json(result)
  })
  .catch(function (err) {
    console.log(err)
    res.json([])
  })
}
