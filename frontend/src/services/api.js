import axios from 'axios';

const api = axios.create({ 
  baseURL: 'https://ranking-tenis-api.onrender.com' 
});

export default api;