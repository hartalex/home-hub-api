const slack = jest.fn().mockReturnValue({ SlackPost: jest.fn().mockResolvedValue({}) })
export default slack
