export default jest.fn().mockReturnValue((req, res, done) => {
  return () => {
    done()
  }
})
