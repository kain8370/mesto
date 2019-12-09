const Card = require('../models/card');

function getCards(req, res) {
  Card.find({})
    .then((cards) => {
      if (cards) {
        res.send({ data: cards });
      } else {
        res.status(404).send({ message: 'Такая карточка не найдена' });
      }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

function createCard(req, res) {
  const { name, link, _id: owner } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

function deleteCard(req, res) {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: 'Такая карточка не найдена' });
      }
    })
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports = {
  getCards, createCard, deleteCard,
};
