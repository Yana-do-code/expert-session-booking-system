const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const expertRoutes = require('./routes/expertRoutes');
const slotRoutes = require('./routes/slotRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Load environment variables from .env
dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io is wired onto the shared HTTP server so the same port serves
// both REST and WebSocket traffic. CORS is wide-open here for local dev.
const io = new Server(server, { cors: { origin: '*' } });

// Core middleware
app.use(cors());
app.use(express.json());

// Make the io instance available to route handlers via req.io so controllers
// can emit events (e.g. slot:updated) without importing the socket module.
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Expert Booking API is running' });
});

// Email test route — dev only, remove before production
app.get('/test-email', async (req, res) => {
  const { sendBookingConfirmation } = require('./utils/mailer');
  try {
    await sendBookingConfirmation({
      to: process.env.EMAIL_USER,
      name: 'Test User',
      expert: { name: 'Pt. Ashok Tiwari', category: 'Vedic Astrology', hourlyRate: 3500 },
      date: '2026-05-10',
      startTime: '10:00',
      endTime: '11:00',
      hourlyRate: 3500,
    });
    res.json({ message: 'Test email sent to ' + process.env.EMAIL_USER });
  } catch (err) {
    res.status(500).json({ message: 'Email failed', error: err.message });
  }
});

// API routes
app.use('/api/experts', expertRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/expert-booking';

// Connect to MongoDB and start the server
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
