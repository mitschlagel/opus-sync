import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CalendarUrlInput } from '../src/components/CalendarUrlInput';
import { useEvents } from '../src/context/EventsContext';

export default function ImportScreen() {
  const { setEvents } = useEvents();

  const handleImport = (events: any[]) => {
    setEvents(events);
    router.back();
  };

  return (
    <View style={styles.container}>
      <CalendarUrlInput onImport={handleImport} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
}); 