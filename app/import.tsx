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
import { importGoogleCalendar } from '../src/utils/calendarImport';

export default function ImportScreen() {
  const theme = useTheme();
  const { addCalendar, addEventsToCalendar } = useEvents();
  const [calendarUrl, setCalendarUrl] = useState('');
  const [calendarName, setCalendarName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    if (!calendarUrl.trim()) {
      Alert.alert('Error', 'Please enter a calendar URL');
      return;
    }
    if (!calendarName.trim()) {
      Alert.alert('Error', 'Please enter a calendar name');
      return;
    }

    setIsLoading(true);
    try {
      // First parse the calendar data
      const events = await importGoogleCalendar(calendarUrl.trim());
      
      // Create a new calendar
      const calendarId = await addCalendar(calendarName.trim());
      
      // Add the events to the calendar
      await addEventsToCalendar(calendarId, events);

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
      console.error('Import error:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to import calendar');
    } finally {
      setIsLoading(false);
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
          editable={!isLoading}
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
          editable={!isLoading}
        />

        <TouchableOpacity
          style={[
            styles.importButton, 
            { backgroundColor: theme.primary },
            isLoading && { opacity: 0.7 }
          ]}
          onPress={handleImport}
          disabled={isLoading}
        >
          <Text style={styles.importButtonText}>
            {isLoading ? 'Importing...' : 'Import Calendar'}
          </Text>
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  importButton: {
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  importButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 