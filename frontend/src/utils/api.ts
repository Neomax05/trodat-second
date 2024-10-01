import axios from 'axios';
// onrender
// const baseURL = 'https://trodat-kg.onrender.com/api';
const baseURL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: baseURL,
  responseType: 'json',
});
