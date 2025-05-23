import { format } from 'date-fns';
import { StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useEvents } from '../../src/context/EventsContext';
import { useTheme } from '../../src/theme';

type MarkedDates = {
  [date: string]: {
    marked: boolean;
    dotColor: string;
  };
};

export default function CalendarScreen() {
  const theme = useTheme();
  const { events } = useEvents();

  // Convert events to calendar format
  const markedDates: MarkedDates = events.reduce((acc: MarkedDates, event) => {
    const dateStr = format(event.startDate, 'yyyy-MM-dd');
    acc[dateStr] = {
      marked: true,
      dotColor: theme.accent
    };
    return acc;
  }, {});

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.calendarContainer, { backgroundColor: theme.cardBackground }]}>
        <Calendar
          style={styles.calendar}
          theme={{
            calendarBackground: theme.cardBackground,
            textSectionTitleColor: theme.textSecondary,
            selectedDayBackgroundColor: theme.primary,
            selectedDayTextColor: theme.cardBackground,
            todayTextColor: theme.primary,
            dayTextColor: theme.text,
            textDisabledColor: theme.textTertiary,
            monthTextColor: theme.text,
            textMonthFontWeight: '600',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 13,
            arrowColor: theme.primary,
          }}
          markedDates={markedDates}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  calendarContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  calendar: {
    borderRadius: 12,
  },
}); 