const mongoose = require ('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  aboutMe: String,
  name: String,
  image: {
    type: String,
    default: ''
  },
  causes: {
    type: Array,
    default: []
  },
  ranking: Number
},{
  timestamps:{
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User',userSchema);
module.exports = User;
