import axios from 'axios';
import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const res = await api.post('/login', payload);
  return res.data;
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await api.post('/register', payload);
  return res.data;
}
