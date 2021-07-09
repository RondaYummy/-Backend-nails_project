const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const authhelper = require('../utils/authHelper');
const {
  secret,
} = require('../../config/development.json').jwt;
const models = require('../models/index');

// FUNCTION UPDATE TOKENS
const updateTokens = (userId) => {
  const accessToken = authhelper.generateAccesToken(userId);
  const refreshToken = authhelper.generateRefreshToken();
  return authhelper.replaceDbRefreshToken(refreshToken.id, userId)
    .then(() => ({
      accessToken,
      refreshToken: refreshToken.token,
    }));
};

const signIn = async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  const user = await models.User.findOne({
    email,
  }).select('+password').exec();

  if (!user) {
    res.status(401).json({
      message: 'AuthError',
    });
    return;
  }
  const isValid = await bcrypt.compareSync(password, user.password);
  if (!isValid) {
    res.status(401).json({
      message: 'AuthError',
    });
    return;
  }
  user.password = null;

  if (isValid) {
    const updatedToken = await updateTokens(user._id);
    console.log('updatedToken', updatedToken);
    res.cookie('token', updatedToken);
    if (updatedToken) {
      res.json({
        // updatedToken,
        user,
      });
    }
  }
};

const refreshTokens = async (req, res) => {
  const {
    refreshToken,
  } = req.body;
  let payload;
  try {
    payload = jwt.verify(refreshToken, secret);
    if (payload.type !== 'refresh') {
      res.status(400).json({
        message: 'Invalid token!',
      });
      return;
    }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.status(400).json({
        message: 'Token experied!',
      });
      return;
    }
    if (e instanceof jwt.JsonWebTokenError) {
      res.status(400).json({
        message: 'invalid token!',
      });
      return;
    }
  }
  const token = await models.UserToken.findOne({
    tokenId: payload.id,
  }).exec();

  if (token === null) {
    throw new Error('Invalid token!');
  }
  try {
    const updatedTokens = await updateTokens(token.user);

    res.json(updatedTokens);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const signUp = async (req, res) => {
  try {
    // Валідацію провіряти!!!
    const {
      email,
      password,
      firstName,
      lastName,
      gender,
      age,
      phone,
      role,
      TermsOfServiceAndPrivacyPolicy,
    } = await req.body;

    const currentUser = await models.User.findOne({
      email,
    });
    const currentUserPhone = await models.User.findOne({
      phone,
    });
    if (currentUserPhone) {
      return res.status(400).json({
        errors: 'RegError',
      });
    }
    if (currentUser) {
      return res.status(400).json({
        errors: 'RegError',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new models.User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      gender,
      age,
      phone,
      role,
      TermsOfServiceAndPrivacyPolicy,
    });
    await user.save();

    // Не відправляти пароль.
    return res.status(201).json({
      message: 'The user has been successfully created.',
      user,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: 'Something went wrong.',
    });
  }
};

module.exports = {
  signIn,
  refreshTokens,
  signUp,
};
