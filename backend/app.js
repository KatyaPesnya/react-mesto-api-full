const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');
const crypto = require('crypto'); // экспортируем crypto
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const allowedCors = [
  'https://mesto.pesnya.nomoredomains.club',
  'http://mesto.pesnya.nomoredomains.club',
  'https://api.mesto.pesnya.nomoredomains.club',
  'http://api.mesto.pesnya.nomoredomains.club',
  'localhost:3000',
];

//  app.use((req, res, next) => {
//   const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
//   // проверяем, что источник запроса есть среди разрешённых
//   if (allowedCors.includes(origin)) {
//     res.header('Access-Control-Allow-Origin', origin);
//   }
//   next();
// });
// const requestHeaders = req.headers['access-control-request-headers'];
// const { method } = req;
// // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
// const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
// // Если это предварительный запрос, добавляем нужные заголовки
// if (method === 'OPTIONS') {
//   // разрешаем кросс-доменные запросы любых типов (по умолчанию)
//   res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//   res.header('Access-Control-Allow-Headers', requestHeaders);
//   return res.end():
// }
const randomString = crypto
  .randomBytes(16) // сгенерируем случайную последовательность 16 байт (128 бит)
  .toString('hex'); // приведём её к строке

console.log(randomString);
require('dotenv').config();

// console.log(process.env.NODE_ENV);
const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors({
  origin: allowedCors,
}));
app.use('/', express.json());
app.use(helmet());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8)
      .pattern(new RegExp('^[A-Za-z0-9]{8,30}$')),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string()
      .regex(/^(https?:\/\/)?([\da-z\\.-]+)\.([a-z\\.]{2,6})([\\/\w \\.-]*)*\/?$/),
  }),
}), createUser);

app.use(auth);

app.use('/', usersRoutes);
app.use('/', cardsRoutes);

app.all('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  console.log(err, err.message, err.name);
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
