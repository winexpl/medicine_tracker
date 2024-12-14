import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Link , router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CourseContext, getCourses, saveCourses } from '../../../../contexts/CoursesContext';
import { dosageFormTo, getCourseInfo } from '../../../../components/Models';
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
  },[courses, medicaments]);
    return (
    <SafeAreaView className="flex-1 bg-primary-back p-4">
      <ScrollView className="flex-1 mb-12">
      {activeCourses.active.length > 0 ? (
        activeCourses.active.map((course, index) => (
        <TouchableOpacity key={course.id} onPress={() => {
          router.push({
          pathname: 'activeCourseInfo',
          params: course  // передаем объект курса в параметры
          });
        }}>
          <View className="p-4 bg-primary-text mb-3 rounded-lg border border-gray-300">
            <Text className="font-bold">{course.medicament}</Text>
            <Text className="text-sm mt-2">
              Осталось приемов: {course.numberMedicine} {'\n'}
              Доза: {course.dose} {dosageFormTo(course.dosageForm)}
            </Text>
            <Text>Начало: {new Date(course.startDate).toLocaleDateString()}</Text>
            <Text>Завершится: {new Date(course.endDate).toLocaleDateString()}</Text>
          </View>
        </TouchableOpacity>
          
        ))
        ) : (
          <Text className="text-white">Нет активных курсов</Text>
        )}
      </ScrollView>

      <TouchableOpacity className="bg-primary-text px-5 py-3 rounded items-center absolute bottom-0 left-0 right-0" onPress={async () => {
        router.push('(addcourse)/addCourse');}}>
        <Text className="text-black">Добавить курс</Text>
      </TouchableOpacity>
    </SafeAreaView>
    
  );
};
