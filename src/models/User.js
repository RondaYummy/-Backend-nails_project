const {
  Schema,
  model,
} = require('mongoose');

const options = {
  discriminatorKey: 'role',
  timestamps: true,
  virtuals: {
    toObject: true,
    toJSON: true,
  },
};

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
  },
  age: {
    type: Number,
  },
  phone: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  TermsOfServiceAndPrivacyPolicy: {
    type: String,
    enum: ['notAccept', 'confirmed'],
    default: 'notAccept',
  },
  role: {
    type: String,
    enum: ['admin', 'master', 'client', 'globalAdmin'],
    default: 'client',
  },
}, options);

UserSchema.virtual('fullName').get(function getFullName() {
  return `${this.lastName} ${this.firstName} ${this.middleName || ''}`.trim();
});

const User = model('User', UserSchema);

const MasterUser = User.discriminator('Master',
  new Schema({
    photoWorks: [{
      type: String,
    }],
    salon: [{
      type: Schema.Types.ObjectId,
      ref: 'Salon',
    }],
    certificates: {
      type: [{
        type: String, // Фотографії сертифікатів майстра, якщо вони є.
      }],
    },
  },
  options));

const AdminUser = User.discriminator('Admin',
  new Schema({
    // Обєкт з даними про салони, які закріплені за цим адміном
    salons: [{
      type: Schema.Types.ObjectId,
      ref: 'Salon',
    }],
  },
  options));

User.MasterUser = MasterUser;
User.AdminUser = AdminUser;
User.User = User;

module.exports = User;
