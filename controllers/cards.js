const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

function getCards(req, res, next) {
  Card.find({})
    .then((cards) => {
      if (cards) {
        res.send({ data: cards });
      } else {
        throw new NotFoundError('Такая карточка не найдена');
      }
    })
    .catch(next);
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch(next);
}

function deleteCard(req, res, next) {
  Card.findById(req.params.cardId, (err) => {
    if (err) {
      next(new NotFoundError('Такая карточка не найдена!'));
    }
  })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такая карточка не найдена!');
      }
      if (card.owner.toString() === req.user._id.toString()) {
        Card.remove(card)
          .then((data) => res.send({ data }));
      } else {
        throw new ForbiddenError('У вас нету доступа к чужой карточке!');
      }
    })
    .catch(next);
}

module.exports = {
  getCards, createCard, deleteCard,
};
