import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CalendarEvent } from '../types';
import { importGoogleCalendar } from '../utils/calendarImport';

interface CalendarUrlInputProps {
  onImport: (events: CalendarEvent[]) => void;
}

export const CalendarUrlInput: React.FC<CalendarUrlInputProps> = ({ onImport }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a Google Calendar URL');
      return;
    }

    if (!url.includes('calendar.google.com')) {
      Alert.alert('Error', 'Please enter a valid Google Calendar URL');
      return;
    }

    setLoading(true);
    try {
      const events = await importGoogleCalendar(url.trim());
      onImport(events);
      setUrl('');
      Alert.alert('Success', 'Calendar imported successfully!');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to import calendar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Import Google Calendar</Text>
      <Text style={styles.instructions}>
        1. Open Google Calendar{'\n'}
        2. Find &apos;Settings and sharing&apos;{'\n'}
        3. Make calendar public{'\n'}
        4. Copy the calendar URL{'\n'}
        5. Paste it below
      </Text>
      <TextInput
        style={styles.input}
        value={url}
        onChangeText={setUrl}
        placeholder="Enter Google Calendar URL"
        placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
      />
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleImport}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Importing...' : 'Import Calendar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  instructions: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2089dc',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#b4d2ea',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 