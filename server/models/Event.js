// server/models/Event.js

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL from Cloudinary or another image host
  },
  cafe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cafe',
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

// Mongoose middleware to automatically set the status before saving
eventSchema.pre('save', function(next) {
  const today = new Date();
  // Set time to the beginning of the day for accurate date comparison
  today.setHours(0, 0, 0, 0);

  // If the event date is before today, it's inactive. Otherwise, it's active.
  if (this.date < today) {
    this.status = 'inactive';
  } else {
    this.status = 'active';
  }
  next();
});


module.exports = mongoose.model('Event', eventSchema);