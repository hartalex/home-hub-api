const db = require('./db/mongodb')()
export const getButtonCount = (dbobj) => {
  return new Promise(function (resolve) {
    let query = {
      id: 1
    }

    db.queryOneData(dbobj, query, 'button', function (err, button) {
      if (err) {
        throw err
      }
      if (!button) {
        button = { id: 1, count: 0 }
      }
      resolve(button)
    })
  })
}
