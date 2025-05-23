import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useEvents } from '../src/context/EventsContext';

export default function ManageCalendarsScreen() {
  const { 
    calendars, 
    activeCalendarId, 
    setActiveCalendarId, 
    deleteCalendar,
    isLoading 
  } = useEvents();

  const handleDelete = (calendarId: string) => {
    Alert.alert(
      'Delete Calendar',
      'Are you sure you want to delete this calendar? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteCalendar(calendarId)
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2089dc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {calendars.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No calendars imported yet</Text>
          <TouchableOpacity 
            style={styles.importButton}
            onPress={() => router.push('/import')}
          >
            <Text style={styles.importButtonText}>Import Calendar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.header}>Your Calendars</Text>
          {calendars.map(calendar => (
            <View key={calendar.id} style={styles.calendarItem}>
              <TouchableOpacity
                style={[
                  styles.calendarButton,
                  calendar.id === activeCalendarId && styles.activeCalendar
                ]}
                onPress={() => setActiveCalendarId(calendar.id)}
              >
                <View style={styles.calendarInfo}>
                  <Text style={styles.calendarName}>{calendar.name}</Text>
                  <Text style={styles.calendarDate}>
                    Updated {calendar.lastUpdated.toLocaleDateString()}
                  </Text>
                </View>
                {calendar.id === activeCalendarId && (
                  <Ionicons name="checkmark-circle" size={24} color="#2089dc" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(calendar.id)}
              >
                <Ionicons name="trash-outline" size={24} color="#ff3b30" />
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  calendarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  calendarButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
  },
  activeCalendar: {
    backgroundColor: '#e6f3ff',
  },
  calendarInfo: {
    flex: 1,
  },
  calendarName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  calendarDate: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  importButton: {
    backgroundColor: '#2089dc',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  importButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 