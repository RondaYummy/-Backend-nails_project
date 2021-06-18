const {
  Schema,
  model,
} = require('mongoose');

const UserToken = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});
module.exports = model('UserToken', UserToken);
