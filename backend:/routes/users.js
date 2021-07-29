const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;

const {
  getUsers, getUserById, updateProfile, updateAvatar, getProfile,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/me', getProfile);

router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный id');
    }),
  }),
}), getUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required()
      .regex(/^(https?:\/\/)?([\da-z\\.-]+)\.([a-z\\.]{2,6})([\\/\w \\.-]*)*\/?$/),
  }),
}),
updateAvatar);

module.exports = router;
