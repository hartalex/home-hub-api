import jsonResponseHandler from '../../jsonResponseHandler'
import fetch from 'isomorphic-fetch'
export default async (config) => {
  if (config.openweathermap_key !== '') {
    try {
      const fetchResult = await fetch(
        config.weatherUrl + '?zip=' + config.zipCode + ',us&units=imperial&APPID=' + config.openweathermap_key
      )
      const jsonResult = await jsonResponseHandler(fetchResult)
      return { ok: true, data: jsonResult }
    } catch (err) {
      let error = err
      if (err.message) {
        error = err.message
      }
      return { ok: false, error }
    }
  } else {
    return { ok: false, error: 'weather api key not found in configuration' }
  }
}
