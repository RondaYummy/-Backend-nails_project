const {
  Schema,
  model,
} = require('mongoose');

const options = {
  discriminatorKey: 'role',
  timestamps: true,
};

const SalonSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  masters: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  admin: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
}, options);

module.exports = model('Salon', SalonSchema);
