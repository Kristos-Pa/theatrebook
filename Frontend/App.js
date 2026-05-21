// Εισαγωγή βασικών βιβλιοθηκών React και Navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

// Εισαγωγή του AuthProvider και useAuth για διαχείριση σύνδεσης
import { AuthProvider, useAuth } from './context/AuthContext';

// Εισαγωγή όλων των οθονών της εφαρμογής
import LoginScreen      from './screens/LoginScreen';
import RegisterScreen   from './screens/RegisterScreen';
import HomeScreen       from './screens/HomeScreen';
import ShowDetailScreen from './screens/ShowDetailScreen';
import BookingScreen    from './screens/BookingScreen';
import ProfileScreen    from './screens/ProfileScreen';

// Δημιουργία navigators
const Stack = createStackNavigator();  // Για οθόνες που στοιβάζονται (push/pop)
const Tab   = createBottomTabNavigator(); // Για την κάτω μπάρα πλοήγησης

// Κάτω μπάρα πλοήγησης — εμφανίζεται μετά τη σύνδεση
function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBarOptions={{ activeTintColor: '#1a1a2e' }}>
      {/* Tab παραστάσεων — περιέχει stack με πολλές οθόνες */}
      <Tab.Screen name="Παραστάσεις" component={HomeStack}
        options={{ tabBarIcon: () => <Text>🎭</Text> }} />
      {/* Tab προφίλ */}
      <Tab.Screen name="Προφίλ" component={ProfileScreen}
        options={{ tabBarIcon: () => <Text>👤</Text> }} />
    </Tab.Navigator>
  );
}

// Stack navigator για τις οθόνες παραστάσεων
// Επιτρέπει πλοήγηση: Αρχική → Λεπτομέρειες → Κράτηση
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home"       component={HomeScreen}
        options={{ title: 'Παραστάσεις' }} />
      <Stack.Screen name="ShowDetail" component={ShowDetailScreen}
        options={{ title: 'Λεπτομέρειες' }} />
      <Stack.Screen name="Booking"    component={BookingScreen}
        options={{ title: 'Κράτηση' }} />
    </Stack.Navigator>
  );
}

// Stack navigator για τις οθόνες σύνδεσης/εγγραφής
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login"    component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Κεντρικός navigator — αποφασίζει αν εμφανιστεί το Auth ή το Home
// Βασίζεται στο αν υπάρχει συνδεδεμένος χρήστης (user)
function RootNavigator() {
  const { user } = useAuth();
  return (
    <NavigationContainer>
      {/* Αν υπάρχει χρήστης → HomeTabs, αλλιώς → AuthStack */}
      {user ? <HomeTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

// Κεντρικό component της εφαρμογής
// Τυλίγει όλη την εφαρμογή με τον AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}