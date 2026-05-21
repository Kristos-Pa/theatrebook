import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  // State για τα πεδία φόρμας εγγραφής
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth(); // Ανάκτηση συνάρτησης εγγραφής από το Context

  // Χειρισμός πατήματος κουμπιού εγγραφής
  const handleRegister = async () => {
    try {
      // Κλήση API για δημιουργία νέου λογαριασμού
      await register(name, email, password);
      Alert.alert('Επιτυχία!', 'Ο λογαριασμός δημιουργήθηκε');
      // Επιστροφή στην οθόνη σύνδεσης μετά την επιτυχή εγγραφή
      navigation.goBack();
    } catch {
      Alert.alert('Σφάλμα', 'Το email χρησιμοποιείται ήδη');
    }
  };

  return (
    <View style={s.container}>
      {/* Πεδίο ονόματος */}
      <TextInput style={s.input} placeholder="Όνομα"
        value={name} onChangeText={setName} />
      
      {/* Πεδίο email — απενεργοποίηση αυτόματων κεφαλαίων */}
      <TextInput style={s.input} placeholder="Email"
        value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none" />
      
      {/* Πεδίο κωδικού — κρυφή εισαγωγή */}
      <TextInput style={s.input} placeholder="Κωδικός"
        value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={s.btn} onPress={handleRegister}>
        <Text style={s.btnText}>Εγγραφή</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex:1, padding:24, justifyContent:'center', backgroundColor:'#fff' },
  input:     { borderWidth:1, borderColor:'#ddd', borderRadius:10, padding:14, marginBottom:12, fontSize:15 },
  btn:       { backgroundColor:'#1a1a2e', borderRadius:10, padding:16, alignItems:'center' },
  btnText:   { color:'#fff', fontSize:16, fontWeight:'600' }
});