import weather from './weather'
//import doTest from './do_test'

import fetch from 'isomorphic-fetch'

import slackPost from '../data/slack'
import errorHandlerModule, { errorFunc } from './errorHandler'
import jsonResponseHandler from '../../jsonResponseHandler'
import weatherMockData from './__mocks__/weatherMockData'
import res from './__mocks__/res'
jest.mock('../data/slack')
jest.mock('../../config')
jest.mock('./errorHandler')
jest.mock('../../jsonResponseHandler')

describe('weather', function () {
  const mockFetchReturnValue = { json: () => weatherMockData }
  beforeAll(() => {
    fetch.mockResolvedValue(mockFetchReturnValue)
  })
  afterEach(() => {
    fetch.mockClear()
  })
  describe('#function (req, res)', function () {
    describe('Config', async () => {
      it('should use default config when req.config is undefined', async () => {
        const req = {}

        await weather(req, res)
        expect(slackPost).toHaveBeenCalledWith('defaultSlackUrl')
        expect(errorHandlerModule).toHaveBeenCalled()
        expect(fetch).toHaveBeenCalledWith(
          'defaultWeather?zip=defaultZipCode,us&units=imperial&APPID=defaultOpenWeatherMapKey'
        )
        expect(jsonResponseHandler).toHaveBeenCalledWith(mockFetchReturnValue)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(weatherMockData)
      })

      it('should use req.config when req.config is defined', async () => {
        const req = {
          config: {
            zipCode: 'passedZipCode',
            openweathermap_key: 'passedOpenWeatherMapKey',
            slackUrl: 'passedSlackUrl',
            weatherUrl: 'passedWeather'
          }
        }

        await weather(req, res)
        expect(slackPost).toHaveBeenCalledWith('passedSlackUrl')
        expect(errorHandlerModule).toHaveBeenCalled()
        expect(fetch).toHaveBeenCalledWith(
          'passedWeather?zip=passedZipCode,us&units=imperial&APPID=passedOpenWeatherMapKey'
        )
        expect(jsonResponseHandler).toHaveBeenCalledWith(mockFetchReturnValue)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith(weatherMockData)
      })
    })

    describe('Slack', async () => {
      it('should use create a slack object when req.slack is undefined', async () => {
        const req = {}

        await weather(req, res)
        expect(slackPost).toHaveBeenCalledWith('defaultSlackUrl')
        expect(errorHandlerModule).toHaveBeenCalled()
      })

      it('should use req.slack when req.slack is defined', async () => {
        const req = {
          slack: jest.fn()
        }
        await weather(req, res)
        expect(errorHandlerModule).toHaveBeenCalledWith(req.slack)
      })
    })

    it('should error when the fetch fails', async () => {
      const fetchMockError = 'Mock error'
      fetch.mockRejectedValue(fetchMockError)
      const req = {}

      await weather(req, res)
      expect(errorHandlerModule).toHaveBeenCalled()
      expect(fetch).toHaveBeenCalledWith(
        'defaultWeather?zip=defaultZipCode,us&units=imperial&APPID=defaultOpenWeatherMapKey'
      )
      expect(errorFunc).toHaveBeenCalledWith(fetchMockError)
    })

    it('should error when openweathermap_key is not defined', async () => {
      const req = { config: { openweathermap_key: '' } }

      await weather(req, res)
      expect(errorHandlerModule).toHaveBeenCalled()
      expect(errorFunc).toHaveBeenCalledWith('weather api key not found in configuration')
    })
  })
})
