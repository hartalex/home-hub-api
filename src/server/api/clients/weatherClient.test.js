import weatherClient from './weatherClient'
//import doTest from './do_test'

import fetch from 'isomorphic-fetch'
import jsonResponseHandler from '../../jsonResponseHandler'
import weatherMockData from '../routes/__mocks__/weatherMockData'
jest.mock('../../jsonResponseHandler')

describe('weatherClient', function () {
  const mockFetchReturnValue = { json: () => weatherMockData }
  beforeAll(() => {
    fetch.mockResolvedValue(mockFetchReturnValue)
  })
  afterEach(() => {
    fetch.mockClear()
  })
  describe('#function (req, res)', function () {
    const config = {
      zipCode: 'passedZipCode',
      openweathermap_key: 'passedOpenWeatherMapKey',
      slackUrl: 'passedSlackUrl',
      weatherUrl: 'passedWeather'
    }
    const expectedFetchUrl = 'passedWeather?zip=passedZipCode,us&units=imperial&APPID=passedOpenWeatherMapKey'
    it('should be successful', async () => {
      const result = await weatherClient(config)
      expect(fetch).toHaveBeenCalledWith(expectedFetchUrl)
      expect(jsonResponseHandler).toHaveBeenCalledWith(mockFetchReturnValue)
      expect(result.ok).toBe(true)
      expect(result.data).toBe(weatherMockData)
    })

    it('should error when the fetch fails', async () => {
      const fetchMockError = 'Mock error'
      fetch.mockRejectedValue(fetchMockError)

      const result = await weatherClient(config)
      expect(fetch).toHaveBeenCalledWith(expectedFetchUrl)
      expect(result.error).toBe(fetchMockError)
      expect(result.ok).toBe(false)
    })

    it('should error when openweathermap_key is not defined', async () => {
      const configOverride = { openweathermap_key: '' }
      const result = await weatherClient(configOverride)
      expect(result.error).toBe('weather api key not found in configuration')
      expect(result.ok).toBe(false)
    })
  })
})
