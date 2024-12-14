import { StyleSheet, Text, View } from 'react-native';
import { Tabs, Redirect } from 'expo-router' ;
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { MedicamentProvider } from '../../../contexts/MedicamentContext';

const AdminLayout = () => {
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
          name="search"
          options={{
            title: "Поиск из открытых источников",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <Ionicons name={focused ? 'calendar-sharp' : 'calendar-outline'} color={color} size={24} />
            )
          }}
        />
        <Tabs.Screen
          name="searchDb"
          options={{
            title: "Поиск в базе",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <Ionicons name={focused ? 'calendar-sharp' : 'calendar-outline'} color={color} size={24} />
            )
          }}
        />
        <Tabs.Screen
          name="(setting)"
          options={{
            title: "Настройки",
            headerShown: false,
            tabBarIcon: ({color, focused}) => (
              <Ionicons name={focused ? 'calendar-sharp' : 'calendar-outline'} color={color} size={24} />
            )
          }}
        />
      </Tabs>
    </>
  )
}

export default AdminLayout

const styles = StyleSheet.create({})