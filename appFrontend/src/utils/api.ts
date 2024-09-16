import axios from "axios";
import { isDev } from './constants';

export const api = axios.create({
  baseURL: isDev ? 'http://212.67.8.153:3010/api' : 'http://212.67.8.153:3010/api',
  responseType: 'json'
});