const {
  Schema,
  model,
  Types
} = require('mongoose');
const UserToken = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  refreshToken: {
    type: String,
    required: true
  },
})
module.exports = model('UserToken', UserToken);
