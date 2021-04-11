const jwt = require('jsonwebtoken')

const authenticate = (request, response, next) => {
  const token = request.token
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  request.userId = decodedToken.id
  next()
}

const extractToken = (request, response, next) => {
  const authorizationHeader = request.get('authorization')
  if (authorizationHeader && authorizationHeader.toLowerCase().startsWith('bearer ')) {
    request.token = authorizationHeader.substring(7)
  }
  next()
}

module.exports = {
  extractToken,
  authenticate
}