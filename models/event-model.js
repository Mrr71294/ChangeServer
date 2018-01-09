const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: String,
  image:{
    type: String,
    deafult: ''
  },
  summary: String,
  eventDate: Date,
  duration: Number,
  eventHead: String,
  attendies: Number,
  address: {
    street: String,
    city: String,
    state: String,
    postal: Number
  },
}, {
  timestamps:{
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});


const Event = mongoose.model('Event', eventSchema );
module.exports = Event;
