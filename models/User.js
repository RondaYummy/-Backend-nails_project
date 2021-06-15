const {
  Schema,
  model,
  Types
} = require('mongoose');
const User = new Schema({
  UserEmail: {
    type: String,
    required: true,
    unique: true
  },
  UserPassword: {
    type: String,
    required: true
  },
  UserName: {
    type: String,
  },
  UserGender: {
    type: String
  },
  UserAge: {
    type: Number
  },
  dateRegistration: {
    type: Date
  },
  role: {
    type: String,
    enum: ['admin', 'master', 'client']
  }
})
module.exports = model('User', User);
