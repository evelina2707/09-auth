import axios from 'axios';

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  withCredentials: true,
});

export default api;