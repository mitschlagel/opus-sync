import { format } from 'date-fns';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import { EventNotesModal } from '../components/EventNotesModal';
import { useTheme } from '../theme';
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
  const colorScheme = useColorScheme();
  const theme = useTheme();

  const handleEventPress = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedEvent(null);
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {eventCards.map(card => (
        <View key={card.id} style={styles.cardWrapper}>
          <BlurView
            intensity={80}
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
            style={styles.blurView}
          >
            <View style={[styles.card, { backgroundColor: theme.cardBackgroundTranslucent }]}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{card.groupName}</Text>
              {card.events.map((item, index) => (
                <TouchableOpacity
                  key={`${card.id}-${index}`}
                  style={[
                    styles.eventItem,
                    index !== card.events.length - 1 && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: theme.separator,
                    },
                  ]}
                  onPress={() => handleEventPress(item.event)}
                >
                  <View style={styles.eventHeader}>
                    <Text style={[styles.eventLabel, { color: theme.primary }]}>
                      {item.label}
                    </Text>
                    <Text style={[styles.eventDate, { color: theme.textSecondary }]}>
                      {format(item.event.startDate, 'MMM d, yyyy')}
                    </Text>
                  </View>
                  {item.event.location && (
                    <Text style={[styles.eventLocation, { color: theme.textTertiary }]}>
                      {item.event.location}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </BlurView>
        </View>
      ))}

      <EventNotesModal
        isVisible={isModalVisible}
        event={selectedEvent}
        onClose={handleCloseModal}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  cardWrapper: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  blurView: {
    overflow: 'hidden',
    borderRadius: 20,
  },
  card: {
    padding: 16,
    borderRadius: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  eventItem: {
    paddingVertical: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventLabel: {
    fontSize: 17,
    fontWeight: '500',
    letterSpacing: -0.4,
  },
  eventDate: {
    fontSize: 15,
    fontWeight: '400',
  },
  eventLocation: {
    fontSize: 15,
    marginTop: 4,
  },
}); 