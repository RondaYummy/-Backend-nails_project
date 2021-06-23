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
    // required: true, // todo delete required works?
  },
  refreshToken: {
    type: String,
    // required: true,
  },
  tokenId: {
    type: String,
  },
}, options);

module.exports = model('UserToken', UserToken);
