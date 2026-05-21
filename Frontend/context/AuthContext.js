import React, { createContext, useState, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import client from '../api/client';

// Δημιουργία Context για διαχείριση κατάστασης σύνδεσης σε όλη την εφαρμογή
const AuthContext = createContext();

// Provider που τυλίγει όλη την εφαρμογή και παρέχει τις συναρτήσεις auth
export function AuthProvider({ children }) {
  // Κατάσταση που κρατά τα στοιχεία του συνδεδεμένου χρήστη
  const [user, setUser] = useState(null);

  // Συνάρτηση σύνδεσης — αποθηκεύει token και ενημερώνει το state
  const login = async (email, password) => {
    const res = await client.post('/auth/login', { email, password });
    // Αποθήκευση token στην ασφαλή αποθήκη της συσκευής
    await SecureStore.setItemAsync('token', res.data.token);
    setUser({ name: res.data.name, email });
  };

  // Συνάρτηση εγγραφής — δημιουργεί νέο λογαριασμό
  const register = async (name, email, password) => {
    await client.post('/auth/register', { name, email, password });
  };

  // Συνάρτηση αποσύνδεσης — διαγράφει token και καθαρίζει το state
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

// Custom hook για εύκολη πρόσβαση στο AuthContext
export const useAuth = () => useContext(AuthContext);