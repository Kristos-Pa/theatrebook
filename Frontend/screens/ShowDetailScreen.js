import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import client from '../api/client';

export default function ShowDetailScreen({ route, navigation }) {
  // Λήψη στοιχείων παράστασης από την προηγούμενη οθόνη (HomeScreen)
  const { show } = route.params;
  const [showtimes, setShowtimes] = useState([]); // Διαθέσιμες ώρες παράστασης

  // Φόρτωμα διαθέσιμων ωρών για τη συγκεκριμένη παράσταση
  useEffect(() => {
    client.get('/showtimes', { params: { show_id: show.show_id } })
      .then(r => setShowtimes(r.data));
  }, []);

  return (
    <View style={s.container}>
      {/* Τίτλος και περιγραφή παράστασης */}
      <Text style={s.title}>{show.title}</Text>
      <Text style={s.desc}>{show.description}</Text>
      
      <Text style={s.sectionTitle}>Διαθέσιμες ώρες:</Text>
      
      {/* Λίστα διαθέσιμων ωρών — κάθε επιλογή οδηγεί στην οθόνη κράτησης */}
      <FlatList data={showtimes} keyExtractor={i => String(i.showtime_id)}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.slot}
            onPress={() => navigation.navigate('Booking', { show, showtime: item })}>
            <Text style={s.slotText}>📅 {item.date}  🕐 {item.time}</Text>
          </TouchableOpacity>
        )} />
    </View>
  );
}

const s = StyleSheet.create({
  container:    { flex:1, padding:20, backgroundColor:'#fff' },
  title:        { fontSize:22, fontWeight:'700', color:'#1a1a2e', marginBottom:8 },
  desc:         { fontSize:14, color:'#666', marginBottom:16 },
  sectionTitle: { fontSize:16, fontWeight:'600', marginBottom:10 },
  slot:         { backgroundColor:'#f0f0f0', borderRadius:10, padding:14, marginBottom:8 },
  slotText:     { fontSize:15, color:'#1a1a2e' }
});