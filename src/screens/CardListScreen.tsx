import { format } from 'date-fns';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EventNotesModal } from '../components/EventNotesModal';
import { CalendarEvent } from '../types';

interface GroupedEvent {
  id: string;
  groupName: string;
  events: {
    label: string;
    event: CalendarEvent;
  }[];
}

interface CardListScreenProps {
  eventCards: GroupedEvent[];
}

export function CardListScreen({ eventCards }: CardListScreenProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleEventPress = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedEvent(null);
  };

  return (
    <View style={styles.container}>
      {eventCards.map(card => (
        <View key={card.id} style={styles.card}>
          <Text style={styles.cardTitle}>{card.groupName}</Text>
          {card.events.map((item, index) => (
            <TouchableOpacity
              key={`${card.id}-${index}`}
              style={styles.eventItem}
              onPress={() => handleEventPress(item.event)}
            >
              <View style={styles.eventHeader}>
                <Text style={styles.eventLabel}>{item.label}</Text>
                <Text style={styles.eventDate}>
                  {format(item.event.startDate, 'MMM d, yyyy')}
                </Text>
              </View>
              {item.event.location && (
                <Text style={styles.eventLocation}>{item.event.location}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <EventNotesModal
        isVisible={isModalVisible}
        event={selectedEvent}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1a1a1a',
  },
  eventItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2089dc',
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
}); 