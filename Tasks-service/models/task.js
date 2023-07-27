const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const taskSchema = new Schema({
  taskName: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  isCompleted: { type: Boolean, default: false },
  createdBy: { type: String, required: true }
});

taskSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Task', taskSchema);
