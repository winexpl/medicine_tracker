import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link , router} from 'expo-router'
  
import { SafeAreaView } from 'react-native-safe-area-context'
  
  const CoursesActive = () => {
    const [courses, setCourses] = useState([
      { name: 'Аспирин', remaining: 12, dosage: '1 таблетка' },
      // Add more courses here if needed
    ]);
  
    // Function to add a new course.
    const addCourse = () => {
      const newCourse = { name: 'Новый курс', remaining: 10, dosage: '1 таблетка' };
      setCourses([...courses, newCourse]);
    };
  
    return (
      <SafeAreaView style={styles.container}>

        <ScrollView style={styles.scrollView}>
          {courses.map((course, index) => (
            // я так понимаю курс, вынести в компонент
            <View key={index} style={styles.courseItem}>
              <Text style={styles.courseName}>{course.name}</Text>
              <Text style={styles.courseDetails}>
                Осталось приемов: {course.remaining} {'\n'}
                Доза: {course.dosage}
              </Text>
            </View>
            // конец курса
          ))}
        </ScrollView>
  
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('addCourse')}>
          <Text style={styles.addButtonText}>Добавить курс</Text>
        </TouchableOpacity>
      </SafeAreaView>
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
  
  
  