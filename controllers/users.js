const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


function getUsers(req, res) {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

function getUserById(req, res) {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(404).send({ message: 'Такой пользователь не найден' });
      }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

function createUser(req, res) {
  const name = req.body.name.trim();
  const email = req.body.email.trim();
  const password = req.body.password.trim();
  const about = req.body.about.trim();
  const avatar = req.body.avatar.trim();

  if (password.length < 6) {
    res.status(400).send({ message: 'Bad request!' });
  }
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
    .catch(() => res.status(500).send({ message: 'Произошла ошибка, регистрация не выполнена:(' }));
}

function login(req, res) {
  const { email, password } = req.body;
  let _id = '';
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      _id = user._id;
      return bcryptjs.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      const token = jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).end('Все верно!');
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
}

module.exports = {
  getUsers, getUserById, createUser, login,
};
