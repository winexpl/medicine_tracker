import { StyleSheet, Text, View } from 'react-native';
import { Tabs, Redirect } from 'expo-router' ;
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StatusBar } from 'expo-status-bar';


const TabsLayout = () => {
  return (
    <>
      <StatusBar backgroundColor='#161622' style='light'/>
      <Tabs screenOptions={{
        tabBarActiveTintColor: "#FF8F00", //primary-back
        tabBarInactiveTintColor: '#FF8F00',
        tabBarActiveBackgroundColor: '#161622',
        tabBarInactiveBackgroundColor: '#161622',
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
        />
      </Tabs>
    </>
  )
}

export default TabsLayout

const styles = StyleSheet.create({})