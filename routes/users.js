const router = require('express').Router();
const users = require('../data/users.json');

router.get('/users', (req, res) => {
  res.send(users);
});
router.get('/users/:id', (req, res) => {
  const id = users.find((item) => {return item['_id'] === req.params.id; });
  if (id) {
    res.send(id);
  } else {
    res.status(404).send({ "message": "Нет пользователя с таким id" });
  }
});

module.exports = router;
