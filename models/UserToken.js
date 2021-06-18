const {
  Schema,
  model,
} = require('mongoose');

const UserToken = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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
