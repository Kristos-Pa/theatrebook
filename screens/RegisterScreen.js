import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();

  const handleRegister = async () => {
    try {
      await register(name, email, password);
      Alert.alert('Επιτυχία!', 'Ο λογαριασμός δημιουργήθηκε');
      navigation.goBack();
    } catch {
      Alert.alert('Σφάλμα', 'Το email χρησιμοποιείται ήδη');
    }
  };

  return (
    <View style={s.container}>
      <TextInput style={s.input} placeholder="Όνομα"
        value={name} onChangeText={setName} />
      <TextInput style={s.input} placeholder="Email"
        value={email} onChangeText={setEmail}
        keyboardType="email-address" autoCapitalize="none" />
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