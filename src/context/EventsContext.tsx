import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { CalendarEvent } from '../types';

interface Calendar {
  id: string;
  name: string;
  url: string;
  events: CalendarEvent[];
  lastUpdated: Date;
}

interface EventsContextType {
  calendars: Calendar[];
  activeCalendarId: string | null;
  setActiveCalendarId: (id: string | null) => void;
  addCalendar: (url: string, events: CalendarEvent[], name: string) => Promise<void>;
  deleteCalendar: (id: string) => Promise<void>;
  events: CalendarEvent[]; // Combined events from active calendar
  isLoading: boolean;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);
const STORAGE_KEY = 'opus-sync-calendars';

export function EventsProvider({ children }: { children: ReactNode }) {
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [activeCalendarId, setActiveCalendarId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load calendars from storage on mount
  useEffect(() => {
    loadCalendars();
  }, []);

  const loadCalendars = async () => {
    try {
      const storedCalendars = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedCalendars) {
        const parsedCalendars = JSON.parse(storedCalendars).map((cal: any) => ({
          ...cal,
          events: cal.events.map((event: any) => ({
            ...event,
            startDate: new Date(event.startDate),
            endDate: new Date(event.endDate),
          })),
          lastUpdated: new Date(cal.lastUpdated),
        }));
        setCalendars(parsedCalendars);
        
        // Set the first calendar as active if none is selected
        if (parsedCalendars.length > 0 && !activeCalendarId) {
          setActiveCalendarId(parsedCalendars[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading calendars:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCalendars = async (newCalendars: Calendar[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCalendars));
      setCalendars(newCalendars);
    } catch (error) {
      console.error('Error saving calendars:', error);
    }
  };

  const addCalendar = async (url: string, newEvents: CalendarEvent[], name: string) => {
    const newCalendar: Calendar = {
      id: Date.now().toString(),
      name,
      url,
      events: newEvents,
      lastUpdated: new Date(),
    };

    const updatedCalendars = [...calendars, newCalendar];
    await saveCalendars(updatedCalendars);
    setActiveCalendarId(newCalendar.id);
  };

  const deleteCalendar = async (id: string) => {
    const updatedCalendars = calendars.filter(cal => cal.id !== id);
    await saveCalendars(updatedCalendars);
    
    if (activeCalendarId === id) {
      setActiveCalendarId(updatedCalendars.length > 0 ? updatedCalendars[0].id : null);
    }
  };

  // Get events from the active calendar
  const events = activeCalendarId 
    ? calendars.find(cal => cal.id === activeCalendarId)?.events || []
    : [];

  return (
    <EventsContext.Provider 
      value={{ 
        calendars, 
        activeCalendarId, 
        setActiveCalendarId, 
        addCalendar, 
        deleteCalendar,
        events,
        isLoading 
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
} 