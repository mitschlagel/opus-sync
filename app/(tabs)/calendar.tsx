import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { CalendarUrlInput } from '../../src/components/CalendarUrlInput';
import { useEvents } from '../../src/context/EventsContext';
import { CalendarScreen } from '../../src/screens/CalendarScreen';

export default function Calendar() {
  const { events, setEvents } = useEvents();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <CalendarUrlInput onImport={setEvents} />
        <CalendarScreen events={events} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
}); 