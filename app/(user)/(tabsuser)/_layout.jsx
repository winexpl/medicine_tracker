import { StyleSheet, Text } from 'react-native';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StatusBar } from 'expo-status-bar';

const UserLayout = () => {

  return (
    <>
      <StatusBar backgroundColor='#403a3a' style='light'/>
      <Tabs screenOptions={{
        tabBarActiveTintColor: "#42aaff", //primary-back
        tabBarInactiveTintColor: '#42aaff',
        tabBarActiveBackgroundColor: '#403a3a',
        tabBarInactiveBackgroundColor: '#403a3a',
      }}
      >
        <Tabs.Screen
          name="schedule"
          options={{
            title: "Расписание",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <Ionicons name={focused ? 'calendar-sharp' : 'calendar-outline'} color={color} size={24} />
            )
          }}
        />
        <Tabs.Screen
          name="(courses)"
          options={{
            title: "Курсы",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <Ionicons name={focused ? 'book-sharp' : 'book-outline'} color={color} size={24} />
            )
          }}
        />
        <Tabs.Screen
          name="(setting)"
          options={{
            title: "Настройки",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <Ionicons name={focused ? 'settings-sharp' : 'settings-outline'} color={color} size={24} />
            )
          }}
        />z
      </Tabs>
    </>

    
  )
}

export default UserLayout

const styles = StyleSheet.create({})