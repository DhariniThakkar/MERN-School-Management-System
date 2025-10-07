const mongoose = require('mongoose');

const followUpSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
  },
  motherName: {
    type: String,
  },
  fatherName: {
    type: String,
  },
  studentMobile: {
    type: String,
    required: true,
  },
  standard: {
    type: String,
    required: true,
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin',
    required: true,
  },
  feedback: {
    type: String,
    enum: ['Positive', 'Negative'],
    required: true,
  },
  demo: {
    booked: { type: Boolean, default: false },
    dateTime: { type: Date },
    reason: { type: String },
  },
  followUpDate: {
    type: Date,
    required: true,
  },
  assignedTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'teacher',
  },
  updates: [
    {
      by: { type: mongoose.Schema.Types.ObjectId, ref: 'teacher' },
      message: { type: String, required: true },
      at: { type: Date, default: Date.now },
    },
  ],
  requests: [
    {
      by: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
      message: { type: String, required: true },
      at: { type: Date, default: Date.now },
    },
  ],
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Closed'],
    default: 'Open',
  },
  dueNotified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('followup', followUpSchema);
