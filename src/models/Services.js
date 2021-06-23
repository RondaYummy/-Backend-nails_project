const {
  Schema,
  model,
} = require('mongoose');

const options = {
  timestamps: true,
};

const ServicesSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
}, options);

module.exports = model('Services', ServicesSchema);
