import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import client from '../api/client';

export default function HomeScreen({ navigation }) {
  const [shows, setShows]   = useState([]); // Λίστα παραστάσεων
  const [search, setSearch] = useState(''); // Κείμενο αναζήτησης

  // Φόρτωμα παραστάσεων κατά την εκκίνηση της οθόνης
  useEffect(() => { fetchShows(); }, []);

  // Κλήση API για ανάκτηση παραστάσεων με προαιρετικό φίλτρο τίτλου
  const fetchShows = async (title = '') => {
    const res = await client.get('/shows', { params: { title } });
    setShows(res.data);
  };

  return (
    <View style={s.container}>
      {/* Πεδίο αναζήτησης — καλεί το API σε κάθε αλλαγή κειμένου */}
      <TextInput style={s.search} placeholder="🔍 Αναζήτηση παράστασης..."
        value={search} onChangeText={t => { setSearch(t); fetchShows(t); }} />

      {/* Λίστα παραστάσεων — κάθε κάρτα οδηγεί στη σελίδα λεπτομερειών */}
      <FlatList data={shows} keyExtractor={i => String(i.show_id)}
        renderItem={({ item }) => (
          <TouchableOpacity style={s.card}
            onPress={() => navigation.navigate('ShowDetail', { show: item })}>
            <Text style={s.title}>{item.title}</Text>
            <Text style={s.sub}>⏱ {item.duration_min} λεπτά</Text>
          </TouchableOpacity>
        )} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex:1, backgroundColor:'#f5f5f5', padding:16 },
  search:    { backgroundColor:'#fff', borderRadius:10, padding:12, marginBottom:12, fontSize:15, borderWidth:1, borderColor:'#ddd' },
  card:      { backgroundColor:'#fff', borderRadius:12, padding:16, marginBottom:10, borderLeftWidth:4, borderLeftColor:'#1a1a2e' },
  title:     { fontSize:16, fontWeight:'600', color:'#1a1a2e' },
  sub:       { fontSize:13, color:'#888', marginTop:4 }
});