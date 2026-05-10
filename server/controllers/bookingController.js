const mongoose = require('mongoose');
const TimeSlot = require('../models/TimeSlot');
const Booking = require('../models/Booking');
const Expert = require('../models/Expert');
const { sendBookingConfirmation } = require('../utils/mailer');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Email regex matches the client-side rule exactly so validation errors
// stay consistent across the boundary.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\d{10}$/;

// Returns an `errors` map of field -> message for whichever fields fail.
// An empty object means the payload is valid.
function validatePayload(body) {
  const errors = {};
  const { expertId, slotId, name, email, phone } = body || {};

  if (!expertId || !isValidObjectId(expertId)) {
    errors.expertId = 'Valid expert is required';
  }
  if (!slotId || !isValidObjectId(slotId)) {
    errors.slotId = 'Valid slot is required';
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    errors.name = 'Name is required';
  }

  if (!email || typeof email !== 'string') {
    errors.email = 'Email is required';
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!phone || typeof phone !== 'string') {
    errors.phone = 'Phone is required';
  } else {
    // Strip whitespace before checking — UI inputs frequently include spaces.
    const stripped = phone.replace(/\s+/g, '');
    if (!PHONE_RE.test(stripped)) {
      errors.phone = 'Phone must be exactly 10 digits';
    }
  }

  return errors;
}

// POST /api/bookings
// Body: { expertId, slotId, name, email, phone, notes }
const createBooking = async (req, res) => {
  try {
    const errors = validatePayload(req.body);
    if (Object.keys(errors).length > 0) {
      return res
        .status(400)
        .json({ message: 'Validation failed', errors });
    }

    const { expertId, slotId, name, email, phone, notes } = req.body;

    const slot = await TimeSlot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }
    if (String(slot.expert) !== String(expertId)) {
      return res
        .status(400)
        .json({ message: 'Slot does not belong to this expert' });
    }
    if (slot.isBooked === true) {
      return res
        .status(409)
        .json({ message: 'This slot was just booked by someone else' });
    }

    // Atomic claim of the slot: only succeeds if it's still unbooked.
    // This closes the window between the read above and the write below.
    const claimedSlot = await TimeSlot.findOneAndUpdate(
      { _id: slotId, isBooked: false },
      { $set: { isBooked: true, bookedBy: String(email).trim().toLowerCase() } },
      { new: true }
    );

    if (!claimedSlot) {
      return res
        .status(409)
        .json({ message: 'This slot was just booked by someone else' });
    }

    let booking;
    try {
      booking = await Booking.create({
        expert: expertId,
        slot: slotId,
        name: name.trim(),
        email: String(email).trim().toLowerCase(),
        phone: phone.replace(/\s+/g, ''),
        date: claimedSlot.date,
        startTime: claimedSlot.startTime,
        endTime: claimedSlot.endTime,
        notes: typeof notes === 'string' ? notes.trim() : '',
      });
    } catch (err) {
      // Roll back the slot claim if the booking insert fails (e.g. unique
      // index violation from a duplicate booking row) so the slot stays
      // visible rather than being permanently stuck as booked.
      await TimeSlot.findOneAndUpdate(
        { _id: slotId },
        { $set: { isBooked: false, bookedBy: '' } }
      );

      if (err && err.code === 11000) {
        return res
          .status(409)
          .json({ message: 'This slot was just booked by someone else' });
      }
      throw err;
    }

    if (req.io) {
      req.io.emit('slot:updated', {
        slotId: String(claimedSlot._id),
        expertId: String(claimedSlot.expert),
      });
    }

    // Send confirmation email — fire-and-forget so a mail failure never
    // blocks or rolls back an already-confirmed booking.
    Expert.findById(expertId, 'name category hourlyRate')
      .then((expertDoc) => {
        if (expertDoc) {
          return sendBookingConfirmation({
            to: booking.email,
            name: booking.name,
            expert: expertDoc,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
            hourlyRate: expertDoc.hourlyRate,
          });
        }
      })
      .catch((err) => console.error('Confirmation email failed:', err.message));

    return res.status(201).json(booking);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to create booking', error: err.message });
  }
};

// GET /api/bookings?email=
// Returns all bookings made by the given email, newest first, with the
// linked expert populated for display purposes. An empty array means
// the email has never booked — that is not a 404.
const getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalized = email.trim().toLowerCase();
    if (!EMAIL_RE.test(normalized)) {
      return res.status(400).json({ message: 'Enter a valid email address' });
    }

    const bookings = await Booking.find({ email: normalized })
      .populate('expert', 'name category hourlyRate')
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to fetch bookings', error: err.message });
  }
};

// PATCH /api/bookings/:id/status
// Body: { status }
// Status updates are not real-time — no socket emit on success.
const ALLOWED_STATUSES = ['pending', 'confirmed', 'completed'];

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid booking id' });
    }

    if (!status || !ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    return res.status(200).json(booking);
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to update booking status', error: err.message });
  }
};

module.exports = { createBooking, getBookingsByEmail, updateBookingStatus };
