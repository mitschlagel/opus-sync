import { format } from 'date-fns';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CalendarEvent } from '../types';

interface EventNotesModalProps {
  isVisible: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
}

export function EventNotesModal({ isVisible, event, onClose }: EventNotesModalProps) {
  if (!event) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.title}>{event.title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.date}>
            {format(event.startDate, 'MMMM d, yyyy h:mm a')}
          </Text>
          
          {event.location && (
            <Text style={styles.location}>📍 {event.location}</Text>
          )}

          <ScrollView style={styles.descriptionContainer}>
            {event.description ? (
              <Text style={styles.description}>{event.description}</Text>
            ) : (
              <Text style={styles.noDescription}>No description available</Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#666',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  descriptionContainer: {
    maxHeight: '70%',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  noDescription: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
}); 