import weather from './weather'
import res from './__mocks__/res'
jest.unmock('isomorphic-fetch')

// Makes an actual call out to openweather api
// This requires that the openweathermap_key be set
// in the env vars
describe('weather integration', function () {
  beforeEach(() => {
    res.json.mockClear()
    res.status.mockClear()
  })
  describe('#function (req, res)', function () {
    describe('Success', async () => {
      it('should use default config', async () => {
        const req = {}
        await weather(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json.mock.calls[0][0].base).toBe('stations')
      })
      it('should use default slack when provided in the req', async () => {
        const req = {
          slack: 'fakeSlack'
        }
        await weather(req, res)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json.mock.calls[0][0].base).toBe('stations')
      })
    })

    describe('Fail', async () => {
      it('no weather api given', async () => {
        const req = { config: { openweathermap_key: '', slackUrl: 'http://fake.hartcode.com' } }
        await weather(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({
          result: 'fail',
          reason: 'weather api key not found in configuration'
        })
      })

      it('should fail to fetch because url is bad', async () => {
        const req = {
          config: {
            weatherUrl: 'http://fake.hartcode.com',
            openweathermap_key: 'fakekey',
            slackUrl: 'http://fake.hartcode.com'
          }
        }
        await weather(req, res)
        expect(res.status).toHaveBeenCalledWith(500)
        expect(res.json).toHaveBeenCalledWith({
          result: 'fail',
          reason:
            'request to http://fake.hartcode.com?zip=undefined,us&units=imperial&APPID=fakekey failed, reason: getaddrinfo ENOTFOUND fake.hartcode.com fake.hartcode.com:80'
        })
      })
    })
  })
})
