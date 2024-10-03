import axios from 'axios';
// onrender
const baseURL = 'https://trodat-kg.onrender.com/api';
// const baseURL = 'http://localhost:8080/api';

const localStorageValues = JSON.parse(
  localStorage.getItem('auth-storage') || '{}'
);

export const api = axios.create({
  baseURL: baseURL,
  responseType: 'json',
  headers: localStorageValues?.state?.access_token
    ? {
        Authorization: `Bearer ${localStorageValues.state.access_token}`,
      }
    : {},
});
