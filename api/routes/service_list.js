const db = require('../db/mongodb')
const dbUrl = require('../db/url')

module.exports = function (req, res) {
  // Use connect method to connect to the Server
  db.connect(dbUrl, function (err, dbobj) {
    if (err == null) {
      db.queryData(dbobj, {}, 'services', function (svcs) {
        for (var i = 0; i < svcs.length; i++) {
          delete svcs[i]._id
        }
        res.json(svcs)
        dbobj.close()
      })
    } else {
      console.log('Error connecting to mongo db')
      console.log(err)
      res.json([])
    }
  })
}
