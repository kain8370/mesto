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
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

function deleteCard(req, res) {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Такая карточка не найдена' });
      }
      if (String(card.owner) === String(req.user._id)) {
        Card.findByIdAndRemove(req.params.cardId)
          .then((data) => res.send({ data }));
      } else {
        res.status(403).send({ message: 'У вас нету доступа к чужой карточке' });
      }
    })
    .catch(() => {
      res.status(500).send({ message: 'Произошла ошибка' });
    });
}

module.exports = {
  getCards, createCard, deleteCard,
};
