
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orgSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  orgId: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    required: true,
  },

  resetToken: String,
  resetTokenExpire: Date,
});

module.exports = mongoose.model('Organization', orgSchema);
