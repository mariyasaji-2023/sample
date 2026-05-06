import axios from 'axios';

// const API = axios.create({ baseURL: '/api/auth' });
const API = axios.create({
  baseURL: 'https://sample-7pa7.onrender.com/api/auth'
});

export const register = (data) => API.post('/register', data);
export const login    = (data) => API.post('/login', data);
