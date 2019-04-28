export const errorFunc = jest.fn()
export default jest.fn().mockReturnValue((req, res, done) => {
  errorFunc.mockImplementation(() => {
    done()
  })
  return errorFunc
})
