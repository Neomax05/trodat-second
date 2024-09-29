import axios from 'axios';

// http://127.0.0.1:3010/api

const baseURL = 'https://trodat-kg.onrender.com/api';
// const baseURL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: baseURL,
  responseType: 'json',
});
