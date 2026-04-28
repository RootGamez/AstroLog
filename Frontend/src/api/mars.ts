import axios from 'axios';
import type { MarsSearchResponse, MarsFavoriteCreate, MarsFavorite } from '../types/mars';
import { getAuthToken } from '../auth/storage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api/mars`,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const searchMars = async (params: { date?: string; rover?: string }) => {
  const res = await api.get('/search', { params });
  return res.data as MarsSearchResponse;
};

export const createFavorite = async (data: MarsFavoriteCreate) => {
  const res = await api.post('/favorites', data);
  return res.data as MarsFavorite;
};

export const fetchFavorites = async () => {
  const res = await api.get('/favorites');
  return res.data as MarsFavorite[];
};

export const deleteFavorite = async (id: number) => {
  const res = await api.delete(`/favorites/${id}`);
  return res.data as MarsFavorite;
};
