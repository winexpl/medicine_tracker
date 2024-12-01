import { StyleSheet, Text, View } from 'react-native';
import { Tabs, Redirect } from 'expo-router' ;
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import axios from 'axios';
import { API_URL_GET_COURSES } from '../../constants/constants';
import { getToken } from '../../contexts/Secure';
import { CourseContext, CoursesProvider, getCourses, saveCourses } from '../../contexts/CoursesContext';
import { TakeProvider } from '../../contexts/TakesContext';

const UserLayout = () => {

  return (
    <TakeProvider>
    <CoursesProvider>
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
    </CoursesProvider>
    </TakeProvider>
    
  )
}

export default UserLayout

const styles = StyleSheet.create({})