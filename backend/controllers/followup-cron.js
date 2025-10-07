const FollowUp = require('../models/followUpSchema');
const Notice = require('../models/noticeSchema');

// This controller can be called by a simple scheduled job (external cron) hitting an endpoint
// It checks due followups for today or earlier, and creates a Notice per school once per run.

const processDueFollowUps = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const dueFollowUps = await FollowUp.find({
      specificFollowUpDate: { $lte: startOfDay },
      dueNotified: { $ne: true },
    }).lean();

    if (!dueFollowUps.length) return res.send({ message: 'No due follow-ups' });

    const schoolToCount = new Map();
    for (const fu of dueFollowUps) {
      const key = String(fu.school);
      schoolToCount.set(key, (schoolToCount.get(key) || 0) + 1);
    }

    const notices = [];
    for (const [school, count] of schoolToCount.entries()) {
      notices.push({
        title: 'Follow-Up Reminder',
        details: `${count} follow-up(s) are due today.`,
        date: startOfDay,
        adminID: school,
      });
    }

    for (const n of notices) {
      const notice = new Notice({ ...n, school: n.adminID });
      await notice.save();
    }

    await FollowUp.updateMany(
      { _id: { $in: dueFollowUps.map((d) => d._id) } },
      { $set: { dueNotified: true } }
    );

    res.send({ processed: dueFollowUps.length, notices: notices.length });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { processDueFollowUps };
