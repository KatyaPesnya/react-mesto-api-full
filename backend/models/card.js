const mongoose = require('mongoose');
const { isURL } = require('validator');

const cardSchema = new mongoose.Schema({
  name: { // имя карточки
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: { // ссылка на картинку
    type: String,
    required: [true, "Поле 'link' должно быть заполнено."],
    validate: {
      validator: (v) => isURL(v),
      message: 'Ошибка валидации url адреса',
    },
  },
  owner: { // ссылка на модель аватара карточки
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: [{ // список лайкнувших пост пользователей
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
