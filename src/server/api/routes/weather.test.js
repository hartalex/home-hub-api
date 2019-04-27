import weather from './weather'
//import doTest from './do_test'

import fetch from 'isomorphic-fetch'

import slackPost from '../data/slack'
import errorHandlerModule from './errorHandler'
import jsonResponseHandler from '../../jsonResponseHandler'
import finish from './done'

jest.mock('../data/slack')
jest.mock('../../config')
jest.mock('./errorHandler')
jest.mock('../../jsonResponseHandler')
jest.mock('./done')

describe('weather', function () {
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
          expect(jsonResponseHandler).toHaveBeenCalledWith({})
          expect(res.json).toHaveBeenCalledWith({})
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
          expect(jsonResponseHandler).toHaveBeenCalledWith({})
          expect(res.json).toHaveBeenCalledWith({})
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

    it('should error when openweathermap_key is not defined', (done) => {
      const req = { config: { openweathermap_key: '' } }
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
        expect(jsonResponseHandler).toHaveBeenCalledWith({})
        expect(finish).toHaveBeenCalled()
        done()
      })
    })
  })
})
