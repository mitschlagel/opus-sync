import { Ionicons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function HeaderLeft() {
  return (
    <Text style={styles.headerTitle}>Opus Sync</Text>
  );
}

function HeaderRight({ onPressImport }: { onPressImport: () => void }) {
  return (
    <View style={styles.headerButtons}>
      <TouchableOpacity 
        style={styles.headerButton} 
        onPress={() => router.push('/manage-calendars')}
      >
        <Ionicons name="calendar-sharp" size={24} color="#2089dc" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.headerButton} 
        onPress={onPressImport}
      >
        <Ionicons name="add-circle-outline" size={24} color="#2089dc" />
      </TouchableOpacity>
    </View>
  );
}

export default function TabLayout() {
  const handlePressImport = () => {
    console.log('Import button pressed');
    router.push('/import');
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: '',
        headerLeft: () => <HeaderLeft />,
        headerRight: () => <HeaderRight onPressImport={handlePressImport} />,
        tabBarIcon: ({ focused, color, size }) => {
          const iconName = route.name === 'index' 
            ? (focused ? 'list' : 'list-outline')
            : (focused ? 'calendar' : 'calendar-outline');

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2089dc',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Event Cards',
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar View',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginLeft: 16,
  },
  headerButtons: {
    flexDirection: 'row',
    marginRight: 8,
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
});
