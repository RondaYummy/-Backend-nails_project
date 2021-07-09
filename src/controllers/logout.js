const models = require('../models/index');

const disconnect = async (req, res) => {
  const {
    userId,
  } = await req.body;

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
