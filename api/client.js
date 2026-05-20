import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Δημιουργία axios instance με βασική διεύθυνση του backend
const client = axios.create({
  baseURL: 'http://192.168.1.155:3000' // IP υπολογιστή στο τοπικό δίκτυο
});

// Interceptor — τρέχει αυτόματα πριν από κάθε request
// Προσθέτει το JWT token στο header Authorization
client.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token'); // Ανάκτηση token από ασφαλή αποθήκευση
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default client;