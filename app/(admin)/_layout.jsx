import { StyleSheet, Text, View } from 'react-native';
import { Tabs, Redirect } from 'expo-router' ;
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StatusBar } from 'expo-status-bar';


const AdminLayout = () => {
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
          name="searchBd"
          options={{
            title: "Поиск в базе",
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