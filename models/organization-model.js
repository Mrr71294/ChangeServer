const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const organizationSchema = new Schema({
  name: String,
  image: {
    type: string,
    default: ''
  },
  purpose: String,
  events: {
    type: Array,
    default: []
  }
  }, {
    timestamps:{
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
});

const Organization = mongoose.model('Organization', organizationSchema);
module.exports = Organization;
