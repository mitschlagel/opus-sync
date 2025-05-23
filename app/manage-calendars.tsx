import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useEvents } from '../src/context/EventsContext';
import { useTheme } from '../src/theme';

export default function ManageCalendarsScreen() {
  const theme = useTheme();
  const { calendars, deleteCalendar } = useEvents();

  const handleDeleteCalendar = async (id: string, name: string) => {
    Alert.alert(
      'Delete Calendar',
      `Are you sure you want to delete "${name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteCalendar(id);
          },
        },
      ]
    );
  };

  if (calendars.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.emptyState, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No calendars imported yet
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.calendarList}>
        {calendars.map(calendar => (
          <View
            key={calendar.id}
            style={[styles.calendarItem, { backgroundColor: theme.cardBackground }]}
          >
            <View style={styles.calendarInfo}>
              <Text style={[styles.calendarName, { color: theme.text }]}>
                {calendar.name}
              </Text>
              <Text style={[styles.eventCount, { color: theme.textSecondary }]}>
                {calendar.events.length} events
              </Text>
              <Text style={[styles.lastUpdated, { color: theme.textTertiary }]}>
                Last updated: {calendar.lastUpdated.toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteCalendar(calendar.id, calendar.name)}
            >
              <Ionicons name="trash-outline" size={24} color={theme.accent} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  calendarList: {
    gap: 12,
  },
  calendarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendarInfo: {
    flex: 1,
  },
  calendarName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventCount: {
    fontSize: 15,
    marginBottom: 2,
  },
  lastUpdated: {
    fontSize: 13,
  },
  deleteButton: {
    padding: 8,
  },
}); 