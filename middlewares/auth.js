const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
};
