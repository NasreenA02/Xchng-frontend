const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('xchng_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
};

export const api = {
  post: (path, body) =>
    fetch(`${BASE_URL}${path}`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  get: (path) =>
    fetch(`${BASE_URL}${path}`, { method: 'GET', headers: getHeaders() }).then(handleResponse),
  put: (path, body) =>
    fetch(`${BASE_URL}${path}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
};

export const setAuth = (token, user) => {
  localStorage.setItem('xchng_token', token);
  localStorage.setItem('xchng_user', JSON.stringify(user));
};

export const getUser = () => {
  try { return JSON.parse(localStorage.getItem('xchng_user')); }
  catch { return null; }
};

export const clearAuth = () => {
  localStorage.removeItem('xchng_token');
  localStorage.removeItem('xchng_user');
};