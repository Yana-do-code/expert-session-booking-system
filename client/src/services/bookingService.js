import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000' });

export async function createBooking(payload) {
  const { data } = await api.post('/api/bookings', payload);
  return data;
}

export async function fetchBookingsByEmail(email) {
  const { data } = await api.get('/api/bookings', { params: { email } });
  return data;
}

export async function updateBookingStatus(bookingId, status) {
  const { data } = await api.patch(`/api/bookings/${bookingId}/status`, { status });
  return data;
}
