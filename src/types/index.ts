export interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  description?: string;
}

export interface EventCard {
  id: string;
  groupName: string; // The common term (e.g., "POPS1", "MW1")
  events: CalendarEvent[];
}

export interface EventGroup {
  [key: string]: CalendarEvent[];
} 