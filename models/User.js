const {
  Schema,
  model,
  Types
} = require('mongoose');
const options = {
  discriminatorKey: 'role'
};
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  middleName: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female']
  },
  age: {
    type: Number
  },
  phone: {
    type: String,
    required: true
  },
  promoCodes: [{
    type: Schema.Types.ObjectId,
    ref: 'PromoCodes' // Реалізую нову модель PromoCodes, заборонено адміну використовувати свої ж створенні промо коди
  }],
  role: {
    type: String,
    enum: ['admin', 'master', 'client', 'global']
    /*admin - Адмініструє закріплений за ним салон ( Начальнік ).
      master - працівник який є закріплений за салоном, яким може керувати Admin
      client - не закріплена нізаким особа, має примітивні права.
      global - адміністратор всього сайту, може створювати салони і закріплювати за ними адмінів. 
    */
  }
}, options)

const UserModel = model('UserModel', UserSchema);


const Client = UserModel.discriminator('Client',
  new Schema({
      appointments: [{
        type: Date
      }], // ????????????????????????????????????
      reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review' // Реалізую нову модель відгуків, може тре буде відобразити останні відгуки на головній чи ше шось....
      }],
    },
    options));

const Master = UserModel.discriminator('Master',
  new Schema({
      reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
      }],
      photoWorks: [{
        type: String
      }],
      salon: [{
        type: Schema.Types.ObjectId,
        ref: 'Salon'
      }],
      services: [{
        type: Schema.Types.ObjectId,
        ref: 'Salon' // Створенити модель послуг, які надає майстер в салоні
      }],
      certificates: {
        type: [{
          type: String // Фотографії сертифікатів майстра, якщо вони є?
        }]
      },
    },
    options));

const Admin = UserModel.discriminator('Admin',
  new Schema({
      // Обєкт з даними про салони, які закріплені за цим адміном
      salons: [{
        type: Schema.Types.ObjectId,
        ref: 'Salon'
      }],
      // Обєкт з даними про майстрів, які закріплені за салонами цього адміна
      masters: [{
        type: Schema.Types.ObjectId,
        ref: 'Master'
      }]
    },
    options));

const Global = UserModel.discriminator('Global',
  new Schema({
      // Обєкт з даними про салони, які створив цей global
      salons: [{
        type: Schema.Types.ObjectId,
        ref: 'Salon'
      }],
      // Обєкт з даними про admin, яких створив цей global
      admins: [{
        type: Schema.Types.ObjectId,
        ref: 'Admin'
      }],
      // Закблоковані користувачі цим global
      blocked: [{
        type: Schema.Types.ObjectId,
        ref: 'Client'
      }]
    },
    options));
