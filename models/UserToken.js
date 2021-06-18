const {
  Schema,
  model,
} = require('mongoose');

const options = {
  timestamps: true,
};

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
}, options);
module.exports = model('UserToken', UserToken);
