import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getCourseInfo } from '../../../../components/Models';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CourseContext } from '../../../../contexts/CoursesContext';
import { MedicamentContext } from '../../../../contexts/MedicamentContext';
import { router } from 'expo-router';

const CoursesInactive = () => {
  const { courses, setCourses } = useContext(CourseContext);
  const { medicaments, setMedicaments } = useContext(MedicamentContext);
  const [ inactiveCourses, setInactiveCourses ] = useState(getCourseInfo(courses, medicaments));
  
  useEffect(() => {
    async function update() {
      setInactiveCourses(getCourseInfo(courses, medicaments));
    };
    update();
    console.log(inactiveCourses);
  },[courses, medicaments]);

  return (
    <SafeAreaView className="flex-1 bg-primary-back p-4">
      <ScrollView className="flex-1 mb-12">
      {inactiveCourses.inactive.length > 0 ? (
        inactiveCourses.inactive.map((course, index) => (
        <TouchableOpacity key={course.id} onPress={() => {
            router.push({
            pathname: 'inactiveCourseInfo',
            params: course,  // передаем объект курса в параметры
          });
        }}>
        <View key={index} className="p-4 bg-primary-text mb-4 rounded-lg border border-gray-300">
          <Text className="font-bold">{course.medicament}</Text>
          <Text className="font-bold">{course.id}</Text>
          <Text className="text-sm mt-2">
            Доза: {course.dose} {'\n'}
            Начало: {new Date(course.startDate).toLocaleDateString()} {'\n'}
            Завершен: {new Date(course.endDate).toLocaleDateString()}
          </Text>
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
