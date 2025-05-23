import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { CalendarEvent } from '../types';

interface Calendar {
  id: string;
  name: string;
  events: CalendarEvent[];
  lastUpdated: Date;
}

interface EventsContextType {
  calendars: Calendar[];
  events: CalendarEvent[];
  isLoading: boolean;
  addCalendar: (name: string) => Promise<string>;
  deleteCalendar: (id: string) => Promise<void>;
  addEventsToCalendar: (calendarId: string, events: CalendarEvent[]) => Promise<void>;
  clearCalendarEvents: (calendarId: string) => Promise<void>;
}

const STORAGE_KEY = 'opus-sync-calendars';

const EventsContext = createContext<EventsContextType>({
  calendars: [],
  events: [],
  isLoading: true,
  addCalendar: async () => '',
  deleteCalendar: async () => {},
  addEventsToCalendar: async () => {},
  clearCalendarEvents: async () => {},
});

export function EventsProvider({ children }: { children: ReactNode }) {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCalendars();
  }, []);

  const loadCalendars = async () => {
    try {
      const storedCalendars = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedCalendars) {
        const parsed = JSON.parse(storedCalendars);
        // Convert date strings back to Date objects
        const calendarsWithDates = parsed.map((cal: any) => ({
          ...cal,
          lastUpdated: new Date(cal.lastUpdated),
          events: cal.events.map((event: any) => ({
            ...event,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
          })),
        }));
        setCalendars(calendarsWithDates);
      }
    } catch (error) {
      console.error('Error loading calendars:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCalendars = async (updatedCalendars: Calendar[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCalendars));
    } catch (error) {
      console.error('Error saving calendars:', error);
    }
  };

  const addCalendar = async (name: string): Promise<string> => {
    const newCalendar: Calendar = {
      id: Date.now().toString(),
      name,
      events: [],
      lastUpdated: new Date(),
    };

    const updatedCalendars = [...calendars, newCalendar];
    setCalendars(updatedCalendars);
    await saveCalendars(updatedCalendars);
    return newCalendar.id;
  };

  const deleteCalendar = async (id: string) => {
    const updatedCalendars = calendars.filter(cal => cal.id !== id);
    setCalendars(updatedCalendars);
    await saveCalendars(updatedCalendars);
  };

  const addEventsToCalendar = async (calendarId: string, newEvents: CalendarEvent[]) => {
    const updatedCalendars = calendars.map(cal =>
      cal.id === calendarId
        ? {
            ...cal,
            events: [...cal.events, ...newEvents],
            lastUpdated: new Date(),
          }
        : cal
    );
    setCalendars(updatedCalendars);
    await saveCalendars(updatedCalendars);
  };

  const clearCalendarEvents = async (calendarId: string) => {
    const updatedCalendars = calendars.map(cal =>
      cal.id === calendarId
        ? {
            ...cal,
            events: [],
            lastUpdated: new Date(),
          }
        : cal
    );
    setCalendars(updatedCalendars);
    await saveCalendars(updatedCalendars);
  };

  // Combine all events from all calendars
  const allEvents = calendars.flatMap(cal => cal.events)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  return (
    <EventsContext.Provider
      value={{
        calendars,
        events: allEvents,
        isLoading,
        addCalendar,
        deleteCalendar,
        addEventsToCalendar,
        clearCalendarEvents,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
} 