//require('es6-promise').polyfill()

import default_config from '../../config'
import weatherClient from '../clients/weatherClient'

module.exports = async (req, res) => {
  var config = req.config
  if (typeof config === 'undefined') {
    config = default_config
  }
  const fetchResult = await weatherClient(config)
  if (fetchResult.ok) {
    res.status(200)
    res.json(fetchResult.data)
  } else {
    res.status(500)
    res.json({ result: 'fail', reason: fetchResult.error })
  }
}
