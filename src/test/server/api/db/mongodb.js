var assert = require('assert')
var db = require('../../../../server/api/db/mongodb')
var mockDB = require('./mock-db')
var mockMongoClient = require('./mock-mongo-client')

describe('mongodb', function () {
  describe('#connect()', function () {
    it('should return err because url is null', function () {
      var url = null
      var promise = db().connect(url)
      return promise.then(function (dbobj) {
        /* istanbul ignore next */
        assert.fail('failure was not caught')
      }).catch(function (err) {
        assert.equal(err, 'url cannot be null')
      })
    })

    it('should return err because url is not a string', function () {
      var url = 0
      var promise = db().connect(url)
      return promise.then(function (dbobj) {
        /* istanbul ignore next */
        assert.fail('failure was not caught')
      }).catch(function (err) {
        assert.equal(err, 'url must be a string')
      })
    })

    it('should pass ok', function () {
      var url = 'string'
      var dbobj = db(mockMongoClient.connect())
      return dbobj.connect(url).then(function(dbobj) {
        assert.deepEqual(dbobj, {})
      })
    })

    it('should fail with error', function () {
      var url = 'string'
      var dbobj = db(mockMongoClient.connectFail())
      return dbobj.connect(url).then(function(dbobj) {
          /* istanbul ignore next */
        assert.fail('failure was not caught')
      }).catch(function (err) {
        assert.equal(err, 'error')
      })
    })
  })

  describe('#queryData()', function () {
    var database = db()
    testQuery(database.queryData.bind(database),
      mockDB.queryData.bind(mockDB),
      mockDB.queryDataFail.bind(mockDB))
  })

  describe('#querydistinctData()', function () {
    var database = db()
    testQuery(database.querydistinctData.bind(database),
      mockDB.querydistinctData.bind(mockDB),
      mockDB.querydistinctDataFail.bind(mockDB))
  })


function testQuery(func, mockdbGood, mockdbBad) {
  it('db object is null should return error', function () {
    func(null, null, null, function (error, result) {
      assert.notEqual(error, null)
      assert.equal(typeof result, 'undefined')
    })
  })

  it('query object is null should return error', function () {
    func({}, null, null, function (error, result) {
      assert.notEqual(error, null)
      assert.equal(typeof result, 'undefined')
    })
  })

  testObjectIsNull(func)





  it('db mocked to no error should return empty obj', function () {
    func(mockdbGood(), {}, {}, function (error, result) {
      assert.deepEqual(result, {})
    })
  })
  it('db mocked to error should return error', function () {
    func(mockdbBad(), {}, {}, function (error, result) {
      assert.notEqual(error, null)
      assert.equal(typeof result, 'undefined')
    })
  })
}

  describe('#queryOneData()', function () {
    var database = db()
    testQuery(database.queryOneData.bind(database),
      mockDB.queryOneData.bind(mockDB),
      mockDB.queryOneDataFail.bind(mockDB))
  })

  describe('#queryLastData()', function () {
    it('db object is null should return error', function () {
      db().queryLastData(null, null, null, null, function (error, result) {
        assert.notEqual(error, null)
        assert.equal(typeof result, 'undefined')
      })
    })

    it('query object is null should return error', function () {
      db().queryLastData({}, null, null, null, function (error, result) {
        assert.notEqual(error, null)
        assert.equal(typeof result, 'undefined')
      })
    })

    it('sort object is null should return error', function () {
      db().queryLastData({}, {}, null, null, function (error, result) {
        assert.notEqual(error, null)
        assert.equal(typeof result, 'undefined')
      })
    })

    it('collection object is null should return error', function () {
      db().queryLastData({}, {}, {}, null, function (error, result) {
        assert.notEqual(error, null)
        assert.equal(typeof result, 'undefined')
      })
    })

    it('db mocked to no error should return empty obj', function () {
      db().queryLastData(mockDB.queryLastData(), {}, {}, {}, function (error, result) {
        assert.deepEqual(result, {})
      })
    })
    it('db mocked to error should return error', function () {
      db().queryLastData(mockDB.queryLastDataFail(), {}, {}, {}, function (error, result) {
        assert.notEqual(error, null)
        assert.equal(typeof result, 'undefined')
      })
    })
  })

  describe('#queryAggregateData()', function () {
    var database = db()
    testQuery(database.queryAggregateData.bind(database),
      mockDB.queryAggregateData.bind(mockDB),
      mockDB.queryAggregateDataFail.bind(mockDB))
  })

  describe('#insertData()', function () {
    it('db object is null should return null', function () {
      db().insertData(null, null, null).then(function (result) {
        /* istanbul ignore next */
        assert.fail('failure was not caught')
      }).catch(function (err) {
        assert.equal(err, 'parameter db is null')
      })
    })

    it('collection object is null should return empty array', function () {
      db().insertData({}, null, null).then(function (result) {
        /* istanbul ignore next */
        assert.fail('failure was not caught')
      }).catch(function (err) {
        assert.equal(err, 'parameter collection is null')
      })
    })

    it('obj object is null should return empty array', function () {
      db().insertData({}, {}, null).then(function (result) {
        /* istanbul ignore next */
        assert.fail('failure was not caught')
      }).catch(function (err) {
        assert.equal(err, 'parameter obj is null')
      })
    })
    it('db mocked to no error should return empty obj', function () {
      db().insertData(mockDB.insert(), {}, {}).then(function (result) {
        assert.deepEqual(result, {})
      })
    })
    it('db mocked to error should return the error message', function () {
      db().insertData(mockDB.insertFail(), {}, {}).then(function (result) {
        /* istanbul ignore next */
        assert.fail('failure was not caught')
      }).catch(function (err) {
        assert.equal(err, 'error')
      })
    })
  })

  describe('#deleteData()', function () {
    it('db object is null should return empty array', function () {
      db().deleteData(null, null, null, function (error, result) {
        assert.deepEqual(result, null)
      })
    })

    it('collection object is null should return empty array', function () {
      db().deleteData({}, null, null, function (error, result) {
        assert.deepEqual(result, null)
      })
    })

    var database = db()
    testObjectIsNull(database.deleteData.bind(database))




    it('db mocked to no error should return empty obj', function () {
      db().deleteData(mockDB.remove(), {}, {}, function (error, result) {
        assert.equal(error, null)
        assert.deepEqual(result, {})
      })
    })
    it('db mocked to error should return null', function () {
      db().deleteData(mockDB.removeFail(), {}, {}, function (error, result) {
        assert.deepEqual(result, null)
      })
    })
  })
  function testObjectIsNull(func) {
    it('collection object is null should return null', function () {
      func({}, {}, null, function (error, result) {
        assert.notEqual(error, null)
        assert.equal(typeof result, 'undefined')
      })
    })
  }
})
