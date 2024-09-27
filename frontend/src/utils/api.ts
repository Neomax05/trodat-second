import axios from 'axios';

// http://127.0.0.1:3010/api

export const api = axios.create({
  baseURL: 'https://trodat-kg.onrender.com/api',
  responseType: 'json',
});
