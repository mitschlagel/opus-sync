import { CalendarEvent } from '../types';

interface GroupedEvent {
  id: string;
  groupName: string;
  events: {
    label: string;
    event: CalendarEvent;
  }[];
}

interface EventWithMetadata {
  id: string;
  title: string;
  baseTitle: string;
  eventType: string;
  event: CalendarEvent;
}

const EVENT_TYPE_KEYWORDS = [
  'rehearsal',
  'performance',
  'concert',
  'dress',
  'soundcheck',
  'setup',
  'teardown'
];

function stripEventType(title: string): string {
  const lowerTitle = title.toLowerCase();
  for (const keyword of EVENT_TYPE_KEYWORDS) {
    if (lowerTitle.startsWith(keyword + ' ')) {
      return title.slice(keyword.length).trim();
    }
  }
  return title;
}

function findEventType(title: string): string {
  const lowerTitle = title.toLowerCase();
  for (const keyword of EVENT_TYPE_KEYWORDS) {
    if (lowerTitle.startsWith(keyword)) {
      return title.split(' ')[0]; // Return original case
    }
  }
  return title;
}

function calculateSimilarity(str1: string, str2: string): number {
  const base1 = stripEventType(str1).toLowerCase();
  const base2 = stripEventType(str2).toLowerCase();
  
  // If either string is empty after stripping, they're not similar
  if (!base1 || !base2) return 0;
  
  let matches = 0;
  const words1 = base1.split(' ');
  const words2 = base2.split(' ');
  
  // First check if there are any numerical differences
  const nums1 = words1.filter(w => /\d/.test(w));
  const nums2 = words2.filter(w => /\d/.test(w));
  
  // If both have numbers and they're different, they're not similar
  if (nums1.length > 0 && nums2.length > 0 && !nums1.every(n => nums2.includes(n))) {
    return 0;
  }
  
  // Count matching words
  for (const word1 of words1) {
    for (const word2 of words2) {
      // Exact matches always count
      if (word1 === word2) {
        matches++;
        break;
      }
      // For longer words, check for substring matches
      else if (word1.length > 3 && word2.length > 3 && 
          (word1.includes(word2) || word2.includes(word1))) {
        matches++;
        break;
      }
    }
  }
  
  // Calculate similarity score
  const totalWords = Math.max(words1.length, words2.length);
  return matches / totalWords;
}

export function groupEvents(events: CalendarEvent[]): GroupedEvent[] {
  // First, sort all events chronologically
  const sortedEvents = [...events].sort((a, b) => 
    a.startDate.getTime() - b.startDate.getTime()
  );

  // Prepare events with metadata
  const eventsWithMeta: EventWithMetadata[] = sortedEvents.map(event => ({
    id: event.id,
    title: event.title,
    baseTitle: stripEventType(event.title),
    eventType: findEventType(event.title),
    event: event
  }));

  const groups: GroupedEvent[] = [];
  const processedEvents = new Set<string>();

  // Process events in chronological order
  for (const currentEvent of eventsWithMeta) {
    if (processedEvents.has(currentEvent.id)) continue;

    // Find all similar events
    const similarEvents: EventWithMetadata[] = [];
    for (const otherEvent of eventsWithMeta) {
      if (otherEvent.id === currentEvent.id || processedEvents.has(otherEvent.id)) continue;
      
      const similarity = calculateSimilarity(currentEvent.title, otherEvent.title);
      if (similarity >= 0.6) {
        similarEvents.push(otherEvent);
      }
    }

    if (similarEvents.length === 0) {
      // Single event group
      groups.push({
        id: currentEvent.id,
        groupName: currentEvent.baseTitle,
        events: [{
          label: currentEvent.eventType,
          event: currentEvent.event
        }]
      });
      processedEvents.add(currentEvent.id);
      continue;
    }

    // Sort similar events chronologically
    similarEvents.sort((a, b) => 
      a.event.startDate.getTime() - b.event.startDate.getTime()
    );

    // Start a new group with the current event
    let currentGroup: GroupedEvent = {
      id: currentEvent.id,
      groupName: currentEvent.baseTitle,
      events: [{
        label: currentEvent.eventType,
        event: currentEvent.event
      }]
    };
    processedEvents.add(currentEvent.id);

    // Add similar events, splitting into new groups if there are intervening events
    let lastEventTime = currentEvent.event.startDate.getTime();
    
    for (const similarEvent of similarEvents) {
      const eventTime = similarEvent.event.startDate.getTime();
      
      // Check if any unrelated events occur between the last event and this one
      const hasInterveningEvents = eventsWithMeta.some(e => {
        if (processedEvents.has(e.id)) return false;
        if (calculateSimilarity(e.title, currentEvent.title) >= 0.6) return false;
        
        const eTime = e.event.startDate.getTime();
        return eTime > lastEventTime && eTime < eventTime;
      });

      if (hasInterveningEvents) {
        // Finish current group and start a new one
        groups.push(currentGroup);
        currentGroup = {
          id: similarEvent.id,
          groupName: currentEvent.baseTitle,
          events: []
        };
      }

      currentGroup.events.push({
        label: similarEvent.eventType,
        event: similarEvent.event
      });
      processedEvents.add(similarEvent.id);
      lastEventTime = eventTime;
    }

    // Add the final group
    groups.push(currentGroup);
  }

  // Final sort of all groups by their first event's start date
  return groups.sort((a, b) => 
    a.events[0].event.startDate.getTime() - b.events[0].event.startDate.getTime()
  );
} 