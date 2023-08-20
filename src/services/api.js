import axios from 'axios';

const api = axios.create({
  baseURL: 'https://zeedispatch.com/simply/public/api',
});

export default api;
