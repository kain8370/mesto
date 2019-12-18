const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');

const { NODE_ENV, JWT_SECRET } = process.env;

function getUsers(req, res, next) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
}

function getUserById(req, res, next) {
  User.findById(req.params.id, (err) => {
    if (err) next(new NotFoundError('Такой пользователь не найден!'));
  })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError('Нет пользователя с таким id');
      }
    })
    .catch(next);
}

function createUser(req, res, next) {
  const name = req.body.name.trim();
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const about = req.body.about.trim();
  const avatar = req.body.avatar.trim();

  bcryptjs.hash(password, 10)
    .then((hash) => User.create({
      name, password: hash, email, about, avatar,
    }))
    .then((user) => res.send({
      data: {
        name: user.name,
        email: user.email,
        about: user.about,
        avatar: user.avatar,
      },
    }))
    .catch(next);
}

function login(req, res, next) {
  const { email, password } = req.body;
  let _id = '';
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Неправильна почта или пароль!');
      }
      _id = user._id;
      return bcryptjs.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        throw new BadRequestError('Неправильна почта или пароль!');
      }
      const token = jwt.sign({ _id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      return res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).end('Все верно!');
    })
    .catch(next);
}

module.exports = {
  getUsers, getUserById, createUser, login,
};
