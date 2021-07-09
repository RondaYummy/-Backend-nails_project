const jwt = require('jsonwebtoken');
const {
  v4: uuidv4,
} = require('uuid');
const {
  secret,
  tokens,
} = require('../../config/development.json').jwt;

const {
  UserToken,
} = require('../models');

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
  // GENERATE REFRESH TOKEN ID WITH UUID/V4
  const payload = {
    id: uuidv4(),
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
  await UserToken.findOneAndRemove({
    user: userId,
  }).exec();
  await UserToken.create({
    tokenId,
    user: userId,
  });
};

module.exports = {
  generateAccesToken,
  generateRefreshToken,
  replaceDbRefreshToken,
};
