import axios from "axios";
import { isDev } from './constants';

// http://127.0.0.1:3010/api

export const api = axios.create({
  baseURL: isDev ? 'http://212.67.8.153:3010/api' : 'http://212.67.8.153:3010/api',
  responseType: 'json'
});

