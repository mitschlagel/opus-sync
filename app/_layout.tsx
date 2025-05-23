import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { EventsProvider } from '../src/context/EventsContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <EventsProvider>
        <>
          <Stack
            screenOptions={{
              headerShown: false,
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen 
              name="import" 
              options={{
                headerShown: true,
                headerTitle: 'Import Calendar',
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </>
      </EventsProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
