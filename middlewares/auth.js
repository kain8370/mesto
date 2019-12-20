const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require('../errors/unauthorized-error');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    next(new UnauthorizedError('Необходима авторизация!'));
  }

  try {
    req.user = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    return next();
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация!'));
  }
};
