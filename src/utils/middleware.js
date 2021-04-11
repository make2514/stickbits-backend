const extractToken = (request, response, next) => {
  const authorizationHeader = request.get('authorization')
  if (authorizationHeader && authorizationHeader.toLowerCase().startsWith('bearer ')) {
    request.token = authorizationHeader.substring(7)
  }
  next()
}

module.exports = {
  extractToken
}