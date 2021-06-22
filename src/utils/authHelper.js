const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');
const {
  secret,
  tokens,
} = require('../../config/development.json').jwt;

const UserToken = require('../models/UserToken');

const generateAccesToken = (userId) => {
  const payload = {
    userId,
    type: tokens.acces.type,
  };

  const options = {
    expiresIn: tokens.acces.expiresIn,
  };

  return jwt.sign(payload, secret, options);
};

const generateRefreshToken = () => {
  // id токена
  const payload = {
    id: uuid(),
    type: tokens.refresh.type,
  };

  const options = {
    expiresIn: tokens.refresh.expiresIn,
  };

  return {
    id: payload.id,
    token: jwt.sign(payload, secret, options),
  };
};

const replaceDbRefreshToken = async (tokenId, userId) => {
  // Шукаю токен по юзер айді?
  await UserToken.findOneAndRemove({ userId }).exec();
  // Створюю новий
  await UserToken.create({ tokenId, userId });
};

module.exports = {
  generateAccesToken,
  generateRefreshToken,
  replaceDbRefreshToken,
};
