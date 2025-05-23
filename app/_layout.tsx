import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { EventsProvider } from '../src/context/EventsContext';
import { useTheme } from '../src/theme';

export default function RootLayout() {
  const theme = useTheme();

  return (
    <GestureHandlerRootView style={styles.container}>
      <EventsProvider>
        <View style={styles.container}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.cardBackground,
              },
              headerTintColor: theme.text,
              headerTitleStyle: {
                fontWeight: '600',
                fontSize: 17,
              },
            }}
          >
            <Stack.Screen 
              name="(tabs)" 
              options={{ 
                headerShown: false,
              }} 
            />
            <Stack.Screen 
              name="manage-calendars" 
              options={{
                presentation: 'modal',
                title: 'Manage Calendars',
              }}
            />
            <Stack.Screen 
              name="import" 
              options={{
                presentation: 'modal',
                title: 'Import Calendar',
              }}
            />
          </Stack>
          <StatusBar style="auto" />
        </View>
      </EventsProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
