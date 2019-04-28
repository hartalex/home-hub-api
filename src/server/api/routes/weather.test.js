import weather from './weather'

import default_config from '../../config'
import weatherClient from '../clients/weatherClient'

import res from './__mocks__/res'
jest.mock('../../config')
jest.mock('../clients/weatherClient')

describe('weather', function () {
  describe('#function (req, res)', function () {
    describe('Config', async () => {
      beforeEach(() => {
        weatherClient.mockResolvedValue({ ok: true, data: 'mockData' })
        res.json.mockClear()
        res.status.mockClear()
      })
      it('should use default config when req.config is undefined', async () => {
        const req = {}

        await weather(req, res)
        expect(weatherClient).toHaveBeenCalledWith(default_config)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith('mockData')
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
        expect(weatherClient).toHaveBeenCalledWith(req.config)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith('mockData')
      })
    })

    it('should error when the fetch fails', async () => {
      weatherClient.mockResolvedValue({ ok: false, error: 'mockError' })
      const req = {}

      await weather(req, res)
      expect(weatherClient).toHaveBeenCalledWith(default_config)
      expect(res.status).toHaveBeenCalledWith(500)
      expect(res.json).toHaveBeenCalledWith({ reason: 'mockError', result: 'fail' })
    })
  })
})
