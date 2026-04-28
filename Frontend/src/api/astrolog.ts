import axios from 'axios';
import type { AstrologRecord, AstrologRecordCreate, AstrologRecordUpdate } from '../types/astrologRecord.ts';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: `${API_URL}/records`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchRecords = async (): Promise<AstrologRecord[]> => {
  const res = await api.get('/');
  return res.data;
};

export const fetchRecord = async (id: number): Promise<AstrologRecord> => {
  const res = await api.get(`/${id}`);
  return res.data;
};

export const createRecord = async (data: AstrologRecordCreate): Promise<AstrologRecord> => {
  const res = await api.post('/', data);
  return res.data;
};

export const updateRecord = async (id: number, data: AstrologRecordUpdate): Promise<AstrologRecord> => {
  const res = await api.put(`/${id}`, data);
  return res.data;
};

export const deleteRecord = async (id: number): Promise<AstrologRecord> => {
  const res = await api.delete(`/${id}`);
  return res.data;
};
