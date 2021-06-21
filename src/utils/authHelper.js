const jwt = require('jsonwebtoken');
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

const generateRefreshToken = (id) => {
  const payload = {
    id,
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
  await UserToken.findOneAndRemove({ userId }).exec();
  await UserToken.create({ tokenId, userId });
};

module.exports = {
  generateAccesToken,
  generateRefreshToken,
  replaceDbRefreshToken,
};
