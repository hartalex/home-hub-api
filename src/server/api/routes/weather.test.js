import weather from './weather'
//import doTest from './do_test'

import fetch from 'isomorphic-fetch'

import slackPost from '../data/slack'
import errorHandlerModule, { errorFunc } from './errorHandler'
import jsonResponseHandler from '../../jsonResponseHandler'
import finish from './done'
import weatherMockData from './weatherMockData'

jest.mock('../data/slack')
jest.mock('../../config')
jest.mock('./errorHandler')
jest.mock('../../jsonResponseHandler')
jest.mock('./done')

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
      it('should use default config when req.config is undefined', (done) => {
        const req = {}
        const res = {
          json: jest.fn(),
          status: jest.fn()
        }

        weather(req, res, () => {
          expect(slackPost).toHaveBeenCalledWith('defaultSlackUrl')
          expect(errorHandlerModule).toHaveBeenCalled()
          expect(fetch).toHaveBeenCalledWith(
            'defaultWeather?zip=defaultZipCode,us&units=imperial&APPID=defaultOpenWeatherMapKey'
          )
          expect(jsonResponseHandler).toHaveBeenCalledWith(mockFetchReturnValue)
          expect(res.json).toHaveBeenCalledWith(weatherMockData)
          expect(finish).toHaveBeenCalled()
          done()
        })
      })

      it('should use req.config when req.config is defined', (done) => {
        const req = {
          config: {
            zipCode: 'passedZipCode',
            openweathermap_key: 'passedOpenWeatherMapKey',
            slackUrl: 'passedSlackUrl',
            weatherUrl: 'passedWeather'
          }
        }
        const res = {
          json: jest.fn(),
          status: jest.fn()
        }

        weather(req, res, () => {
          expect(slackPost).toHaveBeenCalledWith('passedSlackUrl')
          expect(errorHandlerModule).toHaveBeenCalled()
          expect(fetch).toHaveBeenCalledWith(
            'passedWeather?zip=passedZipCode,us&units=imperial&APPID=passedOpenWeatherMapKey'
          )
          expect(jsonResponseHandler).toHaveBeenCalledWith(mockFetchReturnValue)
          expect(res.json).toHaveBeenCalledWith(weatherMockData)
          expect(finish).toHaveBeenCalled()
          done()
        })
      })
    })

    describe('Slack', async () => {
      it('should use create a slack object when req.slack is undefined', (done) => {
        const req = {}
        const res = {
          json: jest.fn(),
          status: jest.fn()
        }

        weather(req, res, () => {
          expect(slackPost).toHaveBeenCalledWith('defaultSlackUrl')
          done()
        })
      })

      it('should use req.slack when req.slack is defined', (done) => {
        const req = {
          slack: jest.fn()
        }
        const res = {
          json: jest.fn(),
          status: jest.fn()
        }

        weather(req, res, () => {
          expect(errorHandlerModule).toHaveBeenCalledWith(req.slack)
          done()
        })
      })
    })

    it('should error when the fetch fails', (done) => {
      fetch.mockRejectedValue('error')
      const req = {}
      const res = {
        json: jest.fn(),
        status: jest.fn()
      }

      weather(req, res, () => {
        expect(errorHandlerModule).toHaveBeenCalled()
        expect(errorFunc).toHaveBeenCalledWith('error')
        expect(finish).toHaveBeenCalled()
        done()
      })
    })

    it('should error when openweathermap_key is not defined', (done) => {
      const req = { config: { openweathermap_key: '' } }
      const res = {
        json: jest.fn(),
        status: jest.fn()
      }

      weather(req, res, () => {
        expect(errorHandlerModule).toHaveBeenCalled()
        expect(errorFunc).toHaveBeenCalledWith('weather api key not found in configuration')
        expect(fetch).not.toHaveBeenCalled()
        expect(finish).toHaveBeenCalled()
        done()
      })
    })
  })
})
