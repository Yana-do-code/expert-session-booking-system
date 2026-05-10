const mongoose = require('mongoose');
const TimeSlot = require('../models/TimeSlot');
const Expert = require('../models/Expert');

// Pad a number with a leading zero (e.g. 9 -> '09') so it lines up with
// the 'HH:MM' string format used everywhere else.
const pad2 = (n) => String(n).padStart(2, '0');

// Build a 'YYYY-MM-DD' string from a Date object using local time.
// We deliberately avoid `toISOString()` here because it would shift dates
// across timezones (the slots themselves are timezone-agnostic strings).
const formatLocalDate = (date) => {
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  return `${y}-${m}-${d}`;
};

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/slots/:expertId
// Returns slots for an expert grouped by date, sorted chronologically.
const getSlotsByExpert = async (req, res) => {
  try {
    const { expertId } = req.params;
    if (!isValidObjectId(expertId)) {
      return res.status(400).json({ message: 'Invalid expert id' });
    }

    const slots = await TimeSlot.find({ expert: expertId }).sort({
      date: 1,
      startTime: 1,
    });

    // Group by date while preserving insertion order (which matches the
    // sort above — chronological by date, then by start time).
    const groupsMap = new Map();
    slots.forEach((slot) => {
      if (!groupsMap.has(slot.date)) {
        groupsMap.set(slot.date, []);
      }
      groupsMap.get(slot.date).push(slot);
    });

    const grouped = Array.from(groupsMap.entries()).map(([date, list]) => ({
      date,
      slots: list,
    }));

    return res.json(grouped);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to fetch slots', error: err.message });
  }
};

// POST /api/slots/:expertId/book/:slotId
// Body: { bookedBy }
const bookSlot = async (req, res) => {
  try {
    const { expertId, slotId } = req.params;
    const { bookedBy } = req.body || {};

    if (!isValidObjectId(expertId) || !isValidObjectId(slotId)) {
      return res.status(400).json({ message: 'Invalid id(s)' });
    }
    if (!bookedBy || typeof bookedBy !== 'string') {
      return res.status(400).json({ message: 'bookedBy is required' });
    }

    const slot = await TimeSlot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    if (String(slot.expert) !== String(expertId)) {
      return res
        .status(400)
        .json({ message: 'Slot does not belong to this expert' });
    }
    if (slot.isBooked) {
      return res.status(409).json({ message: 'Slot already booked' });
    }

    slot.isBooked = true;
    slot.bookedBy = bookedBy;
    await slot.save();

    // Notify any connected clients viewing this expert so they can refresh.
    if (req.io) {
      req.io.emit('slot:updated', {
        slotId: String(slot._id),
        expertId: String(slot.expert),
      });
    }

    return res.json(slot);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to book slot', error: err.message });
  }
};

// POST /api/slots/seed/:expertId
// Wipes existing slots for the expert and creates 1-hour slots from
// 09:00 to 17:00 for the next 7 days (8 slots/day = 56 total).
const seedSlots = async (req, res) => {
  try {
    const { expertId } = req.params;
    if (!isValidObjectId(expertId)) {
      return res.status(400).json({ message: 'Invalid expert id' });
    }

    const expert = await Expert.findById(expertId);
    if (!expert) {
      return res.status(404).json({ message: 'Expert not found' });
    }

    await TimeSlot.deleteMany({ expert: expertId });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const docs = [];
    for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
      const day = new Date(today);
      day.setDate(today.getDate() + dayOffset);
      const dateStr = formatLocalDate(day);

      for (let hour = 9; hour < 17; hour += 1) {
        docs.push({
          expert: expertId,
          date: dateStr,
          startTime: `${pad2(hour)}:00`,
          endTime: `${pad2(hour + 1)}:00`,
          isBooked: false,
          bookedBy: '',
        });
      }
    }

    const inserted = await TimeSlot.insertMany(docs);
    return res
      .status(201)
      .json({ message: 'Slots seeded', count: inserted.length });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to seed slots', error: err.message });
  }
};

// POST /api/slots/seed-all
// Seeds 56 slots (7 days × 8 hrs) for every expert in the database.
const seedAllSlots = async (req, res) => {
  try {
    const experts = await Expert.find({}, '_id');
    if (!experts.length) {
      return res.status(404).json({ message: 'No experts found. Seed experts first.' });
    }

    await TimeSlot.deleteMany({});

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const docs = [];
    for (const { _id: expertId } of experts) {
      for (let dayOffset = 0; dayOffset < 7; dayOffset += 1) {
        const day = new Date(today);
        day.setDate(today.getDate() + dayOffset);
        const dateStr = formatLocalDate(day);
        for (let hour = 9; hour < 17; hour += 1) {
          docs.push({
            expert: expertId,
            date: dateStr,
            startTime: `${pad2(hour)}:00`,
            endTime: `${pad2(hour + 1)}:00`,
            isBooked: false,
            bookedBy: '',
          });
        }
      }
    }

    const inserted = await TimeSlot.insertMany(docs);
    return res.status(201).json({ message: 'All slots seeded', count: inserted.length });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to seed all slots', error: err.message });
  }
};

module.exports = { getSlotsByExpert, bookSlot, seedSlots, seedAllSlots };
