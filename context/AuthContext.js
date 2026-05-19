import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useState } from 'react';
import client from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await client.post('/auth/login', { email, password });
    await SecureStore.setItemAsync('token', res.data.token);
    setUser({ name: res.data.name, email });
  };

  const register = async (name, email, password) => {
    await client.post('/auth/register', { name, email, password });
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);