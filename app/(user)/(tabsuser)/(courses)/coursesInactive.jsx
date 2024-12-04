import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getCourseInfo } from '../../../../components/Models';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CourseContext } from '../../../../contexts/CoursesContext';
import { router } from 'expo-router';
import { MedicamentContext } from '../../../../contexts/MedicamentContext';

const CoursesInactive = () => {
  const { courses, setCourses } = useContext(CourseContext);
  const { medicaments, setMedicaments } = useContext(MedicamentContext);
  const [inactiveCourses, setInactiveCourses] = useState(getCourseInfo(courses, medicaments));

  useEffect(() => {
    async function update() {
      setInactiveCourses(getCourseInfo(courses, medicaments));
    }
    update();
  },[courses]);
  
  console.log(inactiveCourses);

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.scrollView}>
    {inactiveCourses.inactive.length > 0 ? (
      inactiveCourses.inactive.map((course, index) => (
      <TouchableOpacity onPress={() => {
          router.push({
          pathname: 'inactiveCourseInfo',
          params: course,  // передаем объект курса в параметры
        });
      }}>
        <View key={index} style={styles.courseItem}>
          <Text style={styles.name}>{course.medicament}</Text>
          <Text style={styles.courseDetails}>Доза: {course.dose}</Text>
          <Text>Завершен {new Date(course.endDate).toLocaleDateString()}</Text>
        </View>
      </TouchableOpacity>
        
      ))
      ) : (
        <Text style={styles.emptyListText}>Нет завершенных курсов</Text>
      )}
    </ScrollView>
    </SafeAreaView>
  );
};

export default CoursesInactive;
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


