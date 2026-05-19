import { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    fetchReservations();
  });
    return unsubscribe;
  }, [navigation]);

  const fetchReservations = async () => {
    try {
      const res = await client.get('/reservations/user');
      setReservations(res.data);
    } catch (err) {
      console.log('Error:', err.response?.data || err.message);
    }
  };

  const cancel = async (id) => {
  try {
    console.log('Ακύρωση κράτησης ID:', id);
    await client.delete(`/reservations/${id}`);
    Alert.alert('Ακυρώθηκε!');
    fetchReservations();
  } catch (err) {
    console.log('Error:', err.response?.data || err.message);
    Alert.alert('Σφάλμα', 'Δεν έγινε ακύρωση');
  }
};

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.avatar}>{user?.name?.[0] ?? '?'}</Text>
        <Text style={s.name}>{user?.name}</Text>
        <Text style={s.email}>{user?.email}</Text>
      </View>

      <Text style={s.sectionTitle}>Οι κρατήσεις μου</Text>
      <FlatList data={reservations} keyExtractor={i => String(i.reservation_id)}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.showTitle}>{item.title}</Text>
            <Text style={s.detail}>📅 {item.date}  🕐 {item.time}</Text>
            <Text style={[s.status, item.status === 'cancelled' && s.cancelled]}>
              {item.status === 'active' ? '✅ Ενεργή' : '❌ Ακυρωμένη'}
            </Text>
            {item.status === 'active' && (
              <TouchableOpacity style={s.cancelBtn} onPress={() => cancel(item.reservation_id)}>
                <Text style={s.cancelText}>Ακύρωση</Text>
              </TouchableOpacity>
            )}
          </View>
        )} />

      <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
        <Text style={s.logoutText}>Αποσύνδεση</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex:1, backgroundColor:'#f5f5f5' },
  header:       { backgroundColor:'#1a1a2e', padding:24, alignItems:'center' },
  avatar:       { width:60, height:60, borderRadius:30, backgroundColor:'#c8a96e', textAlign:'center', lineHeight:60, fontSize:24, color:'#fff', fontWeight:'700', overflow:'hidden' },
  name:         { color:'#fff', fontSize:18, fontWeight:'600', marginTop:8 },
  email:        { color:'rgba(255,255,255,0.6)', fontSize:13 },
  sectionTitle: { fontSize:16, fontWeight:'600', padding:16, paddingBottom:8 },
  card:         { backgroundColor:'#fff', borderRadius:12, padding:14, marginHorizontal:16, marginBottom:10 },
  showTitle:    { fontSize:15, fontWeight:'600', color:'#1a1a2e' },
  detail:       { fontSize:13, color:'#666', marginTop:4 },
  status:       { fontSize:12, marginTop:6, color:'green' },
  cancelled:    { color:'red' },
  cancelBtn:    { marginTop:8, backgroundColor:'#fee', borderRadius:8, padding:8, alignItems:'center' },
  cancelText:   { color:'#c00', fontWeight:'600', fontSize:13 },
  logoutBtn:    { margin:16, borderWidth:1, borderColor:'#ddd', borderRadius:10, padding:14, alignItems:'center' },
  logoutText:   { color:'#666', fontSize:15 }
});