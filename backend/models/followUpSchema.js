const mongoose = require('mongoose');

const followUpUpdateSchema = new mongoose.Schema({
  note: { type: String },
  byRole: { type: String, enum: ['Admin', 'Teacher'] },
  byUser: { type: mongoose.Schema.Types.ObjectId },
  date: { type: Date, default: Date.now },
});

const followUpSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    motherName: { type: String },
    fatherName: { type: String },
    studentMobile: { type: String, required: true },
    sclassName: { type: mongoose.Schema.Types.ObjectId, ref: 'sclass', required: true },
    school: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true },

    feedbackType: { type: String, enum: ['Positive', 'Negative'], required: true },

    demoBooked: { type: Boolean, default: false },
    demoDateTime: { type: Date },
    demoReason: { type: String },

    specificFollowUpDate: { type: Date, required: true },

    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'teacher' },
    status: { type: String, enum: ['Open', 'In Progress', 'Completed'], default: 'Open' },
    requestUpdate: { type: Boolean, default: false },

    updates: [followUpUpdateSchema],

    dueNotified: { type: Boolean, default: false },
    lastUpdateNotifiedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('followup', followUpSchema);
