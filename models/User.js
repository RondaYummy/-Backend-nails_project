const {
  Schema,
  model,
} = require('mongoose');

const options = {
  discriminatorKey: 'role',
  timestamps: true,
};
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
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
  middleName: {
    type: String,
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
  isDeleted:{
    type: Boolean,
    default: false
  },
  promoCodes: [{
    type: Schema.Types.ObjectId,
    ref: 'PromoCodes', // todo Реалізую нову модель PromoCodes, заборонено адміну використовувати свої ж створенні промо коди
  }],
  role: {
    type: String,
    enum: ['admin', 'master', 'client', 'global'],
    /* admin - Адмініструє закріплений за ним салон ( Начальнік ).
      master - працівник який є закріплений за салоном, яким може керувати Admin
      client - не закріплена нізаким особа, має примітивні права.
      global - адміністратор всього сайту, може створювати салони і закріплювати за ними адмінів.
    */
  },
}, options);

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
    services: [{
      type: Schema.Types.ObjectId,
      ref: 'Salon', // Створенити модель послуг, які надає майстер в салоні
    }],
    certificates: {
      type: [{
        type: String, // Фотографії сертифікатів майстра, якщо вони є?
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
    // Обєкт з даними про майстрів, які закріплені за салонами цього адміна
  },
  options));

const GlobalUser = User.discriminator('Global',
  new Schema({
    // Обєкт з даними про салони, які створив цей global
    salons: [{
      type: Schema.Types.ObjectId,
      ref: 'Salon',
    }],
    // Обєкт з даними про admin, яких створив цей global
    admins: [{
      type: Schema.Types.ObjectId,
      ref: 'Admin',
    }],
    // Закблоковані користувачі цим global
    blocked: [{
      type: Schema.Types.ObjectId,
      ref: 'Client',
    }],
  },
  options));

module.exports = {
  User,
  MasterUser,
  AdminUser,
  GlobalUser,
};
