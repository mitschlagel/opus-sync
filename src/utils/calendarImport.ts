import * as FileSystem from 'expo-file-system';
import ICAL from 'ical.js';
import Papa from 'papaparse';
import { CalendarEvent } from '../types';

export async function parseCalendarFile(fileUri: string): Promise<CalendarEvent[]> {
  try {
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    const fileExtension = fileUri.split('.').pop()?.toLowerCase();

    switch (fileExtension) {
      case 'ics':
        return parseICalContent(fileContent);
      case 'csv':
        return parseCSVContent(fileContent);
      default:
        throw new Error('Unsupported file format. Please use .ics or .csv files.');
    }
  } catch (error) {
    console.error('Error parsing calendar file:', error);
    throw error;
  }
}

export async function importGoogleCalendar(url: string): Promise<CalendarEvent[]> {
  try {
    const icalUrl = convertToICalUrl(url);
    const response = await fetch(icalUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch calendar data');
    }

    const content = await response.text();
    return parseICalContent(content);
  } catch (error) {
    console.error('Error fetching calendar:', error);
    throw new Error('Failed to import Google Calendar. Make sure the calendar is public and the URL is correct.');
  }
}

function convertToICalUrl(url: string): string {
  // Remove any trailing slashes
  url = url.replace(/\/$/, '');

  // Handle different Google Calendar URL formats
  if (url.includes('/calendar/embed')) {
    // Extract calendar ID from embed URL
    const params = new URLSearchParams(url.split('?')[1]);
    const calendarId = params.get('src');
    if (!calendarId) {
      throw new Error('Invalid Google Calendar URL');
    }
    return `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`;
  }

  if (url.includes('/calendar/u/')) {
    // Handle personal Google Calendar URLs
    const matches = url.match(/\/calendar\/u\/\d+\/(r|embed)\??(.*?)$/);
    if (!matches) {
      throw new Error('Invalid Google Calendar URL');
    }
    const params = new URLSearchParams(matches[2]);
    const calendarId = params.get('src');
    if (!calendarId) {
      throw new Error('Invalid Google Calendar URL');
    }
    return `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`;
  }

  if (url.includes('calendar.google.com/calendar/ical/')) {
    // Already in iCal format
    return url;
  }

  // Try to extract calendar ID from other URL formats
  const calendarId = extractGoogleCalendarId(url);
  return `https://calendar.google.com/calendar/ical/${encodeURIComponent(calendarId)}/public/basic.ics`;
}

function extractGoogleCalendarId(url: string): string {
  // Extract calendar ID from various Google Calendar URL formats
  const matches = url.match(/\/calendar\/(?:u\/\d+\/)?(?:embed|render)?\/?([\w.-]+@[\w.-]+|[\w]+)/);
  if (!matches) {
    throw new Error('Invalid Google Calendar URL. Please use a public Google Calendar URL.');
  }
  return matches[1];
}

function parseICalContent(content: string): CalendarEvent[] {
  const jcalData = ICAL.parse(content);
  const comp = new ICAL.Component(jcalData);
  const vevents = comp.getAllSubcomponents('vevent');

  return vevents.map((vevent, index) => {
    const event = new ICAL.Event(vevent);
    return {
      id: String(index + 1),
      title: event.summary || 'Untitled Event',
      startDate: event.startDate.toJSDate(),
      endDate: event.endDate.toJSDate(),
      location: event.location || undefined,
      description: event.description || undefined,
    };
  });
}

interface CSVRecord {
  title?: string;
  summary?: string;
  event?: string;
  start_date?: string;
  startDate?: string;
  start?: string;
  end_date?: string;
  endDate?: string;
  end?: string;
  location?: string;
  description?: string;
}

function parseCSVContent(content: string): CalendarEvent[] {
  const { data } = Papa.parse<CSVRecord>(content, {
    header: true,
    skipEmptyLines: true,
  });

  return data.map((record, index) => ({
    id: String(index + 1),
    title: record.title || record.summary || record.event || 'Untitled Event',
    startDate: new Date(record.start_date || record.startDate || record.start || ''),
    endDate: new Date(record.end_date || record.endDate || record.end || record.start_date || record.startDate || record.start || ''),
    location: record.location,
    description: record.description,
  }));
} 