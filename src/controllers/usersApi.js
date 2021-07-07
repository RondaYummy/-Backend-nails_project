const models = require('../models/index');

const currentUser = async (req, res) => {
  try {
    const {
      id,
    } = req.params;

    // Отримую цілого юзера
    const user = await models.User.findOne({
      _id: id,
    }).exec();

    if (!user) {
      return res.status(404).json({
        message: 'Користувач не знайдений.',
      });
    }
    return res.status(200).json({
      message: 'Користувач був отриманий.',
      user: user.select('-password'),
    });
  } catch (e) {
    return res.status(500).json({
      message: 'Щось пішло не так, попробуйте ще раз.',
    });
  }
};

module.exports = {
  currentUser,
};
