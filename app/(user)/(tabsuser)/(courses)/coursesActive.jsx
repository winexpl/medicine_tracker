import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link , router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CourseContext, getCourses, saveCourses } from '../../../../contexts/CoursesContext';
import { getCourseInfo } from '../../../../components/Models';
import { MedicamentContext } from '../../../../contexts/MedicamentContext';
import axios from 'axios';
import { getToken } from '../../../../contexts/Secure';

export default function CoursesActive () {
  const { courses, setCourses } = useContext(CourseContext);
  const { medicaments, setMedicaments } = useContext(MedicamentContext);
  const [activeCourses, setActiveCourses] = useState(getCourseInfo(courses, medicaments));
  
  useEffect(() => {
    async function update() {
      setActiveCourses(getCourseInfo(courses, medicaments));
    }
    update();
  },[courses]);
  
  console.log(activeCourses);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
      {activeCourses.active.length > 0 ? (
        activeCourses.active.map((course, index) => (
        <TouchableOpacity key={course.id} onPress={() => {
          router.push({
          pathname: 'activeCourseInfo',
          params: course  // передаем объект курса в параметры
          });
        }}>
          <View style={styles.courseItem}>
            <Text style={styles.name}>{course.medicament}</Text>
            <Text style={styles.courseDetails}>
              Осталось приемов: {course.numberMedicine} {'\n'}
              Доза: {course.dose}
            </Text>
            <Text>Начало: {new Date(course.startDate).toLocaleDateString()}</Text>
            <Text>Завершится: {new Date(course.endDate).toLocaleDateString()}</Text>
          </View>
        </TouchableOpacity>
          
        ))
        ) : (
          <Text style={styles.emptyListText}>Нет активных курсов</Text>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={async () => {
        router.push('(addcourse)/addCourses');}}>
        <Text style={styles.addButtonText}>Добавить курс</Text>
      </TouchableOpacity>
    </SafeAreaView>
    
  );
};
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
    marginBottom: 50, // Space for the button at the bottom
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


