import weather from './weather'
jest.unmock('isomorphic-fetch')

// Makes an actual call out to openweather api
// This requires that the openweathermap_key be set
// in the env vars
describe('weather integration', function () {
  describe('#function (req, res)', function () {
    describe('Success', async () => {
      it('should use default config', (done) => {
        const req = {}
        const res = {
          json: jest.fn(),
          status: jest.fn()
        }

        weather(req, res, () => {
          expect(res.status).toHaveBeenCalledWith(200)
          expect(res.json.mock.calls[0][0].base).toBe('stations')
          done()
        })
      })
    })
  })
})
