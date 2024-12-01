import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link , router} from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getToken } from '../../../../contexts/Secure';
import { CourseContext, CoursesProvider, getCourses, saveCourses } from '../../../../contexts/CoursesContext';
import { API_URL_GET_COURSES } from '../../../../constants/constants';
import { getCourseInfo } from '../../../../components/Models';
  
  const CoursesActive = () => {
    const { courses, setCourses } = useContext(CourseContext);
    
    const addCourse = () => {
      const newCourse = { name: 'Новый курс', state: 112, dose: '1 таблетка' };
      setCourses([...courses, newCourse]);
    };
    
    return (
    <CoursesProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {getCourseInfo().active.map((course, index) => (
            // ДОБАВИТЬ КНОПКУ ПРОСМОТРА ПОЛНОЙ ИНФЫ О КУРСЕ, А ВНУТРИ ИНФА О МЕДИКАМЕНТЕ
            <View key={index} style={styles.courseItem}>
              <Text style={styles.name}>{course.medicament}</Text>
              <Text style={styles.courseDetails}>
                Осталось приемов: {course.numberMedicine} {'\n'}
                Доза: {course.dose}
              </Text>
            </View>
          ))}
        </ScrollView>
  
        <TouchableOpacity style={styles.addButton} onPress={() => {
          console.log('push');
          router.push('../(addcourse)/addCourse');}}>
          <Text style={styles.addButtonText}>Добавить курс</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </CoursesProvider>
      
    );
  };

  export default CoursesActive;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1C1C2B',
      padding: 10,
    },
    tabs: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    activeTab: {
      flex: 1,
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000',
      backgroundColor: '#B0B0B0',
      padding: 10,
      textAlign: 'center',
    },
    inactiveTab: {
      flex: 1,
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000',
      backgroundColor: '#FF8F00',
      padding: 10,
      textAlign: 'center',
    },
    scrollView: {
      flex: 1,
      marginBottom: 60, // Space for the button at the bottom
    },
    courseItem: {
      padding: 15,
      backgroundColor: '#FFF',
      marginBottom: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#E0E0E0',
    },
    courseName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    courseDetails: {
      fontSize: 14,
      marginTop: 5,
    },
    addButton: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
      backgroundColor: '#FF8F00', 
      padding: 15,
      borderRadius: 5,
      alignItems: 'center',
    },
    addButtonText: {
      fontSize: 16,
      color: '#000',
    },
  });
  
  
  