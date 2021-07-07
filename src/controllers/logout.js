const models = require('../models/index');

// FUNCTION UPDATE TOKENS
const disconnect = async (req, res) => {
  const {
    userId,
  } = req.body;

  const token = await models.UserToken.findOneAndRemove({
    user: userId,
  }).exec();
  if (!token) {
    res.status(400).json({
      message: 'Invalid user!',
    });
  }
  res.status(200).json({
    message: 'Logout success.',
  });
};

module.exports = {
  disconnect,
};
