var MongoClient = require('mongodb').MongoClient

module.exports = {
  connect: function (url, callback) {
    MongoClient.connect(url, callback)
  },

  queryData: function (db, query, collection, callback) {
    var dbcollection = db.collection(collection)
    dbcollection.find(query).toArray(function (err, docs) {
      if (err == null) {
        callback(docs)
      } else {
        console.log('Error finding data in db')
        console.log(err)
        callback([])
      }
    })
  },

  querydistinctData: function (db, query, collection, callback) {
    var dbcollection = db.collection(collection)
    dbcollection.distinct(query).then(function (docs) {
      callback(docs)
    }).catch(function (error) {
      console.log('Error finding distinct data in db')
      console.log(error)
      callback([])
    })
  },

  queryOneData: function (db, find, collection, callback) {
    var dbcollection = db.collection(collection)
    dbcollection.findOne(find, function (err, obj) {
      if (err == null) {
        callback(obj)
      } else {
        console.log('Error finding one data in db')
        console.log(err)
        callback(null)
      }
    })
  },

  queryLastData: function (db, query, sort, collection, callback) {
    var dbcollection = db.collection(collection)
    dbcollection.find(query).sort(sort).limit(1).toArray(function (err, docs) {
      if (err == null) {
        if (docs.length > 0) {
          callback(docs[0])
        } else {
          callback(null)
        }
      } else {
        console.log('Error finding data in db')
        console.log(err)
        callback(null)
      }
    })
  },

  queryAggregateData: function (db, query, collection, callback) {
    var dbcollection = db.collection(collection)
    dbcollection.aggregate(query).toArray(function (err, docs) {
      if (err == null) {
        callback(docs)
      } else {
        console.log('Error finding temperatures in mongo db')
        console.log(err)
        callback([])
      }
    })
  },

  insertData: function (db, collection, obj, callback) {
    var dbcollection = db.collection(collection)
    dbcollection.insert(obj, {
      w: 1
    }, function (err, result) {
      if (err == null) {
        callback(result)
      } else {
        console.log('Error inserting data in db')
        console.log(err)
        callback(null)
      }
    })
  },

  deleteData: function (db, collection, obj, callback) {
    var dbcollection = db.collection(collection)
    dbcollection.remove(obj, {
      w: 1
    }, function (err, result) {
      if (err == null) {
        callback(result)
      } else {
        console.log('Error deleting data in db')
        console.log(err)
        callback(null)
      }
    })
  }
}
