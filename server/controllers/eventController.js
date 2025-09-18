// server/controllers/eventController.js

const Event = require('../models/Event');

/**
 * @desc    Fetch all active (upcoming) events
 * @route   GET /api/events/active
 * @access  Public
 */
exports.getActiveEvents = async (req, res) => {
  try {
    // Find all events with the status of 'active'
    const activeEvents = await Event.find({ status: 'active' })
      .populate('cafe', 'name address') // Attach cafe's name and address
      .sort({ date: 1 }); // Sort by the soonest date first

    res.status(200).json(activeEvents);

  } catch (error)
  {
    console.error('Error fetching active events:', error);
    res.status(500).json({ error: 'Server error while fetching events.' });
  }
};