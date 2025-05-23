import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { CalendarEvent } from '../types';

interface CalendarScreenProps {
  events: CalendarEvent[];
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ events }) => {
  // Convert events to the format expected by react-native-calendars
  const markedDates = events.reduce((acc, event) => {
    const startDate = event.startDate.toISOString().split('T')[0];
    const endDate = event.endDate.toISOString().split('T')[0];
    
    return {
      ...acc,
      [startDate]: {
        marked: true,
        dotColor: '#2089dc',
        selected: true,
        selectedColor: 'rgba(32, 137, 220, 0.2)',
      },
      [endDate]: {
        marked: true,
        dotColor: '#2089dc',
      },
    };
  }, {});

  const onDayPress = (day: DateData) => {
    // Handle day press - can be implemented later to show events for the selected day
    console.log('Selected day', day);
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#2089dc',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#2089dc',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#2089dc',
          selectedDotColor: '#ffffff',
          arrowColor: '#2089dc',
          monthTextColor: '#2d4150',
          indicatorColor: '#2089dc',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
}); 