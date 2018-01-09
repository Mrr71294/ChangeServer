const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campaignSchema = new Schema({
  title: String,
  image:{
    type: String,
    deafult: ''
  },
  summary: String,
  goal: String,
  // organizations: {
  //   type: Array,
  //   deafult: ''
  // },
  events:{
    type: Array,
    deafult: ''
  },
  // donations: {
  //   type: Number,
  //   default: 0
  // },
  active: Boolean
}, {
  timestamps:{
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});


const Campaign = mongoose.model('Campaign', campaignSchema );
module.exports = Campaign;
