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
<<<<<<< HEAD
    <SafeAreaView className="flex-1 bg-primary-back p-4">
      <ScrollView className="flex-1 mb-12">
      {courses.inactive.length > 0 ? (
        courses.inactive.map((course, index) => (
        <TouchableOpacity onPress={() => {
            router.push({
            pathname: 'activeCourseInfo',
            params: course,  // передаем объект курса в параметры
          });
        }}>
        <View key={index} className="p-4 bg-white mb-4 rounded-lg border border-gray-300">
          <Text className="font-bold">{course.medicament}</Text>
          <Text className="text-sm mt-2">
            Осталось приемов: {course.numberMedicine} {'\n'}
            Доза: {course.dose}
          </Text>
=======
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
>>>>>>> 75220c7044a89603250ee2026c9dbba0090f454c
        </View>
      </TouchableOpacity>
        
      ))
      ) : (
        <Text className="text-white">Нет завершенных курсов</Text>
      )}
    </ScrollView>
    </SafeAreaView>
  );
};

export default CoursesInactive;
