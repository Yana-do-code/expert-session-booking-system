import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000' });

export async function createBooking(payload) {
  const { data } = await api.post('/api/bookings', payload);
  return data;
}
