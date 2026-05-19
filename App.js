import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginScreen      from './screens/LoginScreen';
import RegisterScreen   from './screens/RegisterScreen';
import HomeScreen       from './screens/HomeScreen';
import ShowDetailScreen from './screens/ShowDetailScreen';
import BookingScreen    from './screens/BookingScreen';
import ProfileScreen    from './screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab   = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}
      tabBarOptions={{ activeTintColor: '#1a1a2e' }}>
      <Tab.Screen name="Παραστάσεις" component={HomeStack}
        options={{ tabBarIcon: () => <Text>🎭</Text> }} />
      <Tab.Screen name="Προφίλ" component={ProfileScreen}
        options={{ tabBarIcon: () => <Text>👤</Text> }} />
    </Tab.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home"       component={HomeScreen}       options={{ title: 'Παραστάσεις' }} />
      <Stack.Screen name="ShowDetail" component={ShowDetailScreen} options={{ title: 'Λεπτομέρειες' }} />
      <Stack.Screen name="Booking"    component={BookingScreen}    options={{ title: 'Κράτηση' }} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login"    component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const { user } = useAuth();
  return (
    <NavigationContainer>
      {user ? <HomeTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}