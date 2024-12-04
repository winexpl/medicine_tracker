import React, { useState, useContext } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getCourseInfo } from '../../../../components/Models';
import { SafeAreaView } from 'react-native-safe-area-context';

const CoursesInactive = () => {
  const [courses, setCourses] = useState(getCourseInfo());


  return (
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
