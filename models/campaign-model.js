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
  events:{
    type: Array,
    deafult: ''
  },
  user: {
  type: Schema.Types.ObjectId,
  required: true,
  ref: 'User' // "ref" is the string name of a model that the ID refers to
},    
  active: Boolean
}, {
  timestamps:{
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});


const Campaign = mongoose.model('Campaign', campaignSchema );
module.exports = Campaign;
