import { CalendarEvent, EventCard, EventGroup } from '../types';

export const extractGroupName = (title: string): string => {
  // This regex will match sequences of letters/numbers that come before words like "Rehearsal", "Performance", etc.
  const match = title.match(/^([A-Za-z0-9]+(?:\s*[A-Za-z0-9]+)*)/);
  return match ? match[1].trim() : title;
};

export const groupEvents = (events: CalendarEvent[]): EventCard[] => {
  // First, group events by their common terms
  const groupedEvents: EventGroup = events.reduce((groups, event) => {
    const groupName = extractGroupName(event.title);
    
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    
    groups[groupName].push(event);
    return groups;
  }, {} as EventGroup);

  // Convert the grouped events into EventCard array
  return Object.entries(groupedEvents).map(([groupName, events]) => ({
    id: groupName,
    groupName,
    events: events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime()),
  }));
}; 