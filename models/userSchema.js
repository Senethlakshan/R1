const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'user',
  },
  photo: {
    type: String,
  },
  address: {
    type: String,
  },
  fullName: {
    type: String,
  },
  age: {
    type: Number,
    default: null,
  },
});


const User = new mongoose.model('UserInfo', userSchema);

module.exports = User;
