import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

export async function fetchExperts({ search = '', category = '', page = 1, limit = 8 } = {}) {
  const params = { page, limit };
  if (search) params.search = search;
  if (category) params.category = category;

  const { data } = await api.get('/api/experts', { params });
  return data;
}

export async function fetchExpertById(id) {
  const { data } = await api.get(`/api/experts/${id}`);
  return data;
}

export async function fetchSlotsByExpert(expertId) {
  const { data } = await api.get(`/api/slots/${expertId}`);
  return data;
}

export async function bookSlot(expertId, slotId, bookedBy) {
  const { data } = await api.post(`/api/slots/${expertId}/book/${slotId}`, {
    bookedBy,
  });
  return data;
}
