# Vedaz – Astrology Expert Session Booking System

A full-stack real-time booking platform for Vedaz, the AI-powered astrology platform. Users can browse astrologers, view available time slots, book sessions, and track bookings by email — with live slot updates across all connected clients.

---

## Stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express, MongoDB (Mongoose), Socket.io |
| Frontend | React (CRA), Axios, Socket.io-client |
| Database | MongoDB Atlas |

---

## Project Structure

```
server/
├── models/          Expert, TimeSlot, Booking
├── controllers/     expertController, slotController, bookingController
├── routes/          expertRoutes, slotRoutes, bookingRoutes
└── server.js        Express + Socket.io entry point

client/src/
├── pages/           ExpertListingPage, ExpertDetailPage, MyBookingsPage
├── components/      ExpertCard, SearchBar, CategoryFilter, Pagination,
│                    TimeSlotGroup, BookingModal, BookingSuccess
└── services/        expertService, bookingService
```

---

## Features

### 1. Expert Listing
- Browse 20 Vedaz astrologers across 7 categories: Vedic Astrology, Tarot, Numerology, Vastu Shastra, Palmistry, Puja Services, Horoscope
- Search by name, filter by category, paginate (8 per page)
- Sorted by rating descending

### 2. Expert Detail
- Full profile: bio, experience, rating, ₹/hr rate
- Time slots grouped by date (09:00–17:00, 1-hr each, next 7 days)
- Slots update in real-time via Socket.io when booked by any user

### 3. Booking
- Modal form: Name, Email (validated), Phone (10 digits), pre-filled Date & Time Slot, Notes
- Client-side validation on blur + submit; server-side validation mirrors client rules exactly
- On success: confirmation screen with full booking summary
- On conflict: inline "slot just booked" error with auto-refresh

### 4. My Bookings
- Look up all bookings by email
- Each booking shows expert, date, time, rate, and color-coded status
- Status can be updated inline: Pending → Confirmed → Completed

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/experts` | List experts (search, category, page, limit) |
| GET | `/api/experts/:id` | Single expert |
| GET | `/api/slots/:expertId` | Slots grouped by date |
| POST | `/api/slots/seed-all` | Seed 56 slots for every expert |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings?email=` | Bookings by email |
| PATCH | `/api/bookings/:id/status` | Update booking status |

---

## Double Booking Prevention

Two layers enforce one-booking-per-slot:

1. **Atomic DB update** — `findOneAndUpdate({ _id: slotId, isBooked: false })` claims the slot in a single atomic operation. If two requests race, only one succeeds.
2. **Unique index** — `Booking.slot` has a MongoDB unique index. Even if two requests somehow pass the atomic check simultaneously, only one Booking document can be created. The other gets a duplicate-key error and the slot is rolled back.

---

## Real-Time Slot Updates

Socket.io runs on the same port as the REST API (`5000`). When a booking is confirmed, the server emits `slot:updated { slotId, expertId }` to all connected clients. Any client viewing that expert's detail page re-fetches slots immediately — so booked slots go grey across all open tabs without a page refresh.

---

## Running Locally

```bash
# Server
cd server
node server.js        # runs on port 5000

# Client (separate terminal)
cd client
npm start             # runs on port 3000
```

### Environment variables (`server/.env`)
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

### Seed data
```bash
POST http://localhost:5000/api/experts/seed     # 20 astrologers
POST http://localhost:5000/api/slots/seed-all   # 1120 slots (56 per expert)
```
