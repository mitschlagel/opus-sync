import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CalendarUrlInput } from '../src/components/CalendarUrlInput';
import { useEvents } from '../src/context/EventsContext';

export default function ImportScreen() {
  const { addCalendar } = useEvents();

  const handleImport = async (events: any[], url: string, name: string) => {
    await addCalendar(url, events, name);
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