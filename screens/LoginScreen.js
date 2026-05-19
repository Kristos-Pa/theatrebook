import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch {
      Alert.alert('Σφάλμα', 'Λάθος email ή κωδικός');
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>🎭 TheatreBook</Text>
      <Text style={s.sub}>Κρατήσεις θεατρικών παραστάσεων</Text>

      <TextInput style={s.input} placeholder="Email"
        value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={s.input} placeholder="Κωδικός"
        value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={s.btn} onPress={handleLogin}>
        <Text style={s.btnText}>Σύνδεση</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={s.link}>Δεν έχεις λογαριασμό; Εγγραφή</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex:1, backgroundColor:'#1a1a2e', justifyContent:'center', padding:24 },
  title:     { fontSize:32, color:'#fff', textAlign:'center', marginBottom:8 },
  sub:       { fontSize:14, color:'rgba(255,255,255,0.6)', textAlign:'center', marginBottom:32 },
  input:     { backgroundColor:'#fff', borderRadius:10, padding:14, marginBottom:12, fontSize:15 },
  btn:       { backgroundColor:'#c8a96e', borderRadius:10, padding:16, alignItems:'center', marginTop:4 },
  btnText:   { color:'#fff', fontSize:16, fontWeight:'600' },
  link:      { color:'rgba(255,255,255,0.7)', textAlign:'center', marginTop:20, fontSize:14 }
});