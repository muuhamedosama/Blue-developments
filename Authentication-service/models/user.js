const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
2
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
  },
  {
    timestamps: true
  }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
