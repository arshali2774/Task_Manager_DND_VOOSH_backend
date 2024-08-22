const mongoose = require('mongoose');
// task schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    default: 'To Do',
    enum: ['To Do', 'In Progress', 'Done'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  arrIdx: { type: Number },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});
taskSchema.index({ title: 1, userId: 1 }, { unique: true });
const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
