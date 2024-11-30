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
  const { courses, setCourses } = useContext(CourseContext);
  // загружаем курсы
  useEffect(() => {
    async function checkCourses() {
      const coursesSaved = getCourses();
      console.log('check ' + coursesSaved);
    }
    async function fetchCourses() {
      try {
          console.log(getToken());
          const response = await axios.get(API_URL_GET_COURSES, {
              headers: {
                  'Authorization': `Bearer ${getToken()}`,
              },
          });
          const coursesSaved = response.data;
          console.log('response ' + response.data);
          //saveCourses(coursesSaved);
          console.log('courses = ' + coursesSaved);
          setCourses(coursesSaved);
      } catch (err) {
          console.error('Нет доступа к базе данных. ' + err);
      };
    }
    fetchCourses();
    checkCourses();
  }, []);

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