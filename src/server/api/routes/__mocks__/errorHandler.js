export const errorFunc = jest.fn()
export default jest.fn().mockReturnValue((req, res) => {
  return errorFunc
})
