const models = require('../models/index');

// FUNCTION UPDATE TOKENS
const disconnect = async (req, res) => {
  const {
    userId,
  } = req.body;

  await models.UserToken.findOneAndRemove({
    user: userId,
  }).exec();
  res.status(200).json({
    message: 'Logout success.',
  });
};

module.exports = {
  disconnect,
};
