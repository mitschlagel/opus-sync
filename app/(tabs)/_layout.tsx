import { Ionicons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEvents } from '../../src/context/EventsContext';
import { useTheme } from '../../src/theme';

function HeaderLeft() {
  const theme = useTheme();
  return (
    <Text style={[styles.headerTitle, { color: theme.text }]}>Opus Sync</Text>
  );
}

function HeaderRight() {
  const theme = useTheme();
  const { calendars } = useEvents();

  const handlePressCalendars = () => {
    router.push('/manage-calendars');
  };

  const handlePressImport = () => {
    if (calendars.length === 0) {
      // If no calendars exist, create a default one
      router.push('/manage-calendars');
    } else {
      router.push('/import');
    }
  };

  return (
    <View style={styles.headerButtons}>
      <TouchableOpacity 
        style={styles.headerButton} 
        onPress={handlePressCalendars}
      >
        <Ionicons name="calendar-sharp" size={24} color={theme.primary} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.headerButton} 
        onPress={handlePressImport}
      >
        <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
      </TouchableOpacity>
    </View>
  );
}

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.cardBackground,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.separator,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 17,
        },
        tabBarStyle: {
          backgroundColor: theme.cardBackground,
          borderTopWidth: 1,
          borderTopColor: theme.separator,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 56,
          paddingTop: 0,
          paddingBottom: Platform.OS === 'ios' ? 34 : 0,
        },
        tabBarItemStyle: {
          height: 49,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textTertiary,
        headerLeft: () => <HeaderLeft />,
        headerRight: () => <HeaderRight />,
        headerTitle: '',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarLabel: 'List',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: '',
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
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
