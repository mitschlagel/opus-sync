import React, { createContext, ReactNode, useContext, useState } from 'react';
import { CalendarEvent } from '../types';

interface EventsContextType {
  events: CalendarEvent[];
  setEvents: (events: CalendarEvent[]) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>([
    // Initial sample data
    {
      id: '1',
      title: 'POPS1 Rehearsal',
      startDate: new Date('2024-03-20'),
      endDate: new Date('2024-03-20'),
      location: 'Main Hall',
    },
    {
      id: '2',
      title: 'POPS1 Performance',
      startDate: new Date('2024-03-21'),
      endDate: new Date('2024-03-21'),
      location: 'Concert Hall',
    },
  ]);

  return (
    <EventsContext.Provider value={{ events, setEvents }}>
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