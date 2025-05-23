import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useEvents } from '../src/context/EventsContext';
import { useTheme } from '../src/theme';

export default function ImportScreen() {
  const theme = useTheme();
  const { addCalendar } = useEvents();
  const [calendarUrl, setCalendarUrl] = useState('');
  const [calendarName, setCalendarName] = useState('');

  const handleImport = async () => {
    if (!calendarUrl.trim()) {
      Alert.alert('Error', 'Please enter a calendar URL');
      return;
    }
    if (!calendarName.trim()) {
      Alert.alert('Error', 'Please enter a calendar name');
      return;
    }

    try {
      // Here you would fetch and parse the calendar data
      await addCalendar(calendarName.trim());
      Alert.alert(
        'Success',
        'Calendar imported successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to import calendar');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.label, { color: theme.textSecondary }]}>Calendar URL</Text>
        <TextInput
          style={[styles.input, { 
            color: theme.text,
            backgroundColor: theme.background,
            borderColor: theme.separator,
          }]}
          placeholder="https://calendar.google.com/..."
          placeholderTextColor={theme.textTertiary}
          value={calendarUrl}
          onChangeText={setCalendarUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />

        <Text style={[styles.label, { color: theme.textSecondary }]}>Calendar Name</Text>
        <TextInput
          style={[styles.input, { 
            color: theme.text,
            backgroundColor: theme.background,
            borderColor: theme.separator,
          }]}
          placeholder="My Calendar"
          placeholderTextColor={theme.textTertiary}
          value={calendarName}
          onChangeText={setCalendarName}
        />

        <TouchableOpacity
          style={[styles.importButton, { backgroundColor: theme.primary }]}
          onPress={handleImport}
        >
          <Text style={styles.importButtonText}>Import Calendar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
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
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  importButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  importButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 