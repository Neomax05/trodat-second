export const isDev = process.env.NODE_ENV === 'development';

export const imageUrl = !isDev
  ? 'http://212.67.8.153:3010/uploads/'
  : 'http://localhost:8080/uploads/';
