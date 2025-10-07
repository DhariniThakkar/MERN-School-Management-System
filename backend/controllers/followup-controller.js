const FollowUp = require('../models/followUpSchema');

const createFollowUp = async (req, res) => {
  try {
    const {
      studentName,
      motherName,
      fatherName,
      studentMobile,
      sclassName,
      adminID,
      feedbackType,
      demoBooked,
      demoDateTime,
      demoReason,
      specificFollowUpDate,
      assignedTo,
    } = req.body;

    if (!studentName || !studentMobile || !sclassName || !adminID || !feedbackType || !specificFollowUpDate) {
      return res.send({ message: 'Missing required fields' });
    }

    if (demoBooked) {
      if (!demoDateTime) {
        return res.send({ message: 'Demo date & time required when demo is booked' });
      }
    } else if (!demoBooked) {
      if (!demoReason) {
        return res.send({ message: 'Provide a reason when demo is not booked' });
      }
    }

    const followUp = new FollowUp({
      studentName,
      motherName,
      fatherName,
      studentMobile,
      sclassName,
      school: adminID,
      feedbackType,
      demoBooked,
      demoDateTime,
      demoReason,
      specificFollowUpDate,
      assignedTo: assignedTo || undefined,
    });

    const result = await followUp.save();
    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const listFollowUps = async (req, res) => {
  try {
    const schoolId = req.params.id;
    const followUps = await FollowUp.find({ school: schoolId })
      .populate('sclassName', 'sclassName')
      .populate('assignedTo', 'name email');

    if (!followUps || followUps.length === 0) {
      return res.send({ message: 'No follow-ups found' });
    }

    res.send(followUps);
  } catch (error) {
    res.status(500).json(error);
  }
};

const assignFollowUp = async (req, res) => {
  try {
    const { followUpId, teacherId } = req.body;
    if (!followUpId || !teacherId) return res.send({ message: 'followUpId and teacherId are required' });

    const result = await FollowUp.findByIdAndUpdate(
      followUpId,
      { assignedTo: teacherId, status: 'In Progress', requestUpdate: false },
      { new: true }
    ).populate('assignedTo', 'name email');

    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const requestUpdateFromTeacher = async (req, res) => {
  try {
    const { followUpId } = req.body;
    if (!followUpId) return res.send({ message: 'followUpId is required' });

    const result = await FollowUp.findByIdAndUpdate(
      followUpId,
      { requestUpdate: true },
      { new: true }
    );

    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const addFollowUpUpdate = async (req, res) => {
  try {
    const { followUpId, note, byRole, byUser } = req.body;
    if (!followUpId || !byRole || !byUser) return res.send({ message: 'followUpId, byRole, byUser are required' });

    const result = await FollowUp.findByIdAndUpdate(
      followUpId,
      { $push: { updates: { note, byRole, byUser } }, requestUpdate: false },
      { new: true }
    );

    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

const markFollowUpCompleted = async (req, res) => {
  try {
    const { followUpId } = req.body;
    if (!followUpId) return res.send({ message: 'followUpId is required' });

    const result = await FollowUp.findByIdAndUpdate(
      followUpId,
      { status: 'Completed' },
      { new: true }
    );

    res.send(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createFollowUp,
  listFollowUps,
  assignFollowUp,
  requestUpdateFromTeacher,
  addFollowUpUpdate,
  markFollowUpCompleted,
};
