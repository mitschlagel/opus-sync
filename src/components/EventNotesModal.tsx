import { format } from 'date-fns';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../theme';
import { CalendarEvent } from '../types';

interface EventNotesModalProps {
  isVisible: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
}

export function EventNotesModal({ isVisible, event, onClose }: EventNotesModalProps) {
  const theme = useTheme();
  
  if (!event) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.modalView, { backgroundColor: theme.cardBackground }]}>
          <View style={[styles.handle, { backgroundColor: theme.textTertiary }]} />
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
              {event.title}
            </Text>
            <TouchableOpacity 
              onPress={onClose}
              style={[styles.closeButton, { backgroundColor: theme.textTertiary }]}
            >
              <Text style={[styles.closeButtonText, { color: theme.cardBackground }]}>×</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.date, { color: theme.textSecondary }]}>
            {format(event.startDate, 'MMMM d, yyyy h:mm a')}
          </Text>
          
          {event.location && (
            <Text style={[styles.location, { color: theme.textSecondary }]}>
              📍 {event.location}
            </Text>
          )}

          <ScrollView 
            style={styles.descriptionContainer}
            showsVerticalScrollIndicator={false}
          >
            {event.description ? (
              <Text style={[styles.description, { color: theme.text }]}>
                {event.description}
              </Text>
            ) : (
              <Text style={[styles.noDescription, { color: theme.textTertiary }]}>
                No description available
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
    opacity: 0.3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: -2,
  },
  date: {
    fontSize: 16,
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    marginBottom: 16,
  },
  descriptionContainer: {
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  noDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
}); 