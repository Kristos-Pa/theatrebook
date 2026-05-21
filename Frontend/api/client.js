import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Παίρνει αυτόματα την IP του υπολογιστή από το Expo
const { debuggerHost } = Constants.expoConfig.hostUri 
  ? { debuggerHost: Constants.expoConfig.hostUri.split(':')[0] }
  : { debuggerHost: 'localhost' };

// Δημιουργία axios instance με αυτόματη IP
const client = axios.create({
  baseURL: `http://${debuggerHost}:3000`
});

// Interceptor — προσθέτει JWT token σε κάθε request
client.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;