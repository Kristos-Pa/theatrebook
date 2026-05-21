import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import client from '../api/client';

export default function BookingScreen({ route, navigation }) {
  // Λήψη παράστασης και showtime από την προηγούμενη οθόνη
  const { show, showtime } = route.params;
  const [seats, setSeats]       = useState([]); // Όλες οι θέσεις
  const [selected, setSelected] = useState([]); // Επιλεγμένες θέσεις

  // Φόρτωμα θέσεων για το συγκεκριμένο showtime
  useEffect(() => {
    client.get('/seats', { params: { showtime_id: showtime.showtime_id } })
      .then(r => setSeats(r.data));
  }, []);

  // Εναλλαγή επιλογής θέσης — αν είναι κατειλημμένη δεν επιτρέπεται
  const toggleSeat = (seat) => {
    if (seat.is_taken) return; // Κατειλημμένη θέση — αγνόηση
    setSelected(prev =>
      prev.includes(seat.seat_id)
        ? prev.filter(id => id !== seat.seat_id) // Αφαίρεση αν ήδη επιλεγμένη
        : [...prev, seat.seat_id]                // Προσθήκη αν δεν είναι επιλεγμένη
    );
  };

  // Αποστολή κράτησης στο backend
  const confirm = async () => {
    if (selected.length === 0) return Alert.alert('Επίλεξε θέσεις!');
    try {
      await client.post('/reservations', {
        showtime_id: showtime.showtime_id,
        seat_ids: selected // Αποστολή IDs επιλεγμένων θέσεων
      });
      Alert.alert('Επιτυχία! 🎉', 'Η κράτησή σου έγινε!',
        [{ text: 'OK', onPress: () => navigation.navigate('Home') }]);
    } catch {
      Alert.alert('Σφάλμα', 'Δοκίμασε ξανά');
    }
  };

  return (
    <View style={s.container}>
      <Text style={s.title}>{show.title}</Text>
      <Text style={s.sub}>📅 {showtime.date}  🕐 {showtime.time}</Text>

      <Text style={s.sectionTitle}>Επίλεξε θέσεις:</Text>
      {/* Πλέγμα θέσεων — 5 στήλες */}
      <FlatList data={seats} keyExtractor={i => String(i.seat_id)} numColumns={5}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[s.seat,
              item.is_taken              && s.taken,  // Γκρι αν κατειλημμένη
              selected.includes(item.seat_id) && s.picked]} // Χρυσή αν επιλεγμένη
            onPress={() => toggleSeat(item)}>
            <Text style={s.seatTxt}>{item.seat_number}</Text>
          </TouchableOpacity>
        )} />

      <Text style={s.summary}>Επιλεγμένες: {selected.length} θέσεις</Text>
      <TouchableOpacity style={s.btn} onPress={confirm}>
        <Text style={s.btnText}>Επιβεβαίωση Κράτησης</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex:1, padding:20, backgroundColor:'#fff' },
  title:        { fontSize:20, fontWeight:'700', color:'#1a1a2e' },
  sub:          { color:'#666', marginBottom:16, marginTop:4 },
  sectionTitle: { fontSize:16, fontWeight:'600', marginBottom:10 },
  seat:         { width:52, height:40, margin:4, borderRadius:8, backgroundColor:'#e0e0e0', alignItems:'center', justifyContent:'center' },
  taken:        { backgroundColor:'#ccc' },
  picked:       { backgroundColor:'#c8a96e' },
  seatTxt:      { fontSize:11, fontWeight:'600' },
  summary:      { fontSize:15, marginVertical:16, color:'#333' },
  btn:          { backgroundColor:'#1a1a2e', borderRadius:10, padding:16, alignItems:'center' },
  btnText:      { color:'#fff', fontSize:16, fontWeight:'600' }
});