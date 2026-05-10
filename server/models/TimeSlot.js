const mongoose = require('mongoose');

// Slot times are stored as strings ('HH:MM') and dates as 'YYYY-MM-DD'
// to avoid timezone-related drift when grouping slots in the UI.
const timeSlotSchema = new mongoose.Schema(
  {
    expert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Expert',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    bookedBy: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Helpful index for the most common query: "all slots for an expert,
// grouped by date and ordered chronologically".
timeSlotSchema.index({ expert: 1, date: 1, startTime: 1 });

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
