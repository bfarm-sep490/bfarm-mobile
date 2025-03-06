import axios from 'axios';

export const baseURL = 'https://api.outfit4rent.online/api/';

export const mockAPI = axios.create({
  baseURL,
});
