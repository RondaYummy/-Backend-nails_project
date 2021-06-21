const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const authhelper = require('../src/utils/authHelper');
const {
  secret,
} = require('../config/development.json').jwt;
const UserToken = require('../src/models/UserToken');
const User = require('../src/models/User');

const updateTokens = (userId) => {
  const accessToken = authhelper.generateAccesToken(userId);
  const refreshToken = authhelper.generateRefreshToken();

  return authhelper.replaceDbRefreshToken(refreshToken.id, userId)
    .then(() => ({
      accessToken,
      refreshToken: refreshToken.token,
    }));
};
const signIn = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) {
        res.status(401).json({ message: 'User does not exist!' });
      }

      const isValid = bcrypt.compareSync(password, user.password);

      // Якщо все добре і пароль підійшов видаю токен
      if (isValid) {
        updateTokens(user._id)
          .then((tokens) => res.json(tokens));
      }
    });
};

const refreshTokens = (req, res) => {
  const {
    refreshToken,
  } = req.body;
  let payload;
  try {
    payload = jwt.verify(refreshToken, secret);

    if (payload.type !== 'refresh') {
      res.status(400).json({ message: 'Invalid token!' });
      return;
    }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.status(400).json({ message: 'Token experied!' });
    } else if (e instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ message: 'invalid token!' });
    }

    UserToken.findOne({ user: payload.id }).exec()
      .then((token) => {
        if (token === null) {
          throw new Error('Invalid token!');
        }
        // token.userId ?
        return updateTokens(token.userId);
      })
      .then((tokens) => res.json(tokens))
      .catch((err) => res.status(400).json({ message: err.message }));
  }
};

module.exports = {
  signIn,
  refreshTokens,
};
