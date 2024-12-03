import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router'
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { CourseContext, getCourses, saveCourses } from '../../contexts/CoursesContext';
import { updateTakes } from '../../components/Models';

const ActiveCourseInfo = () => {
  const { courses, setCourses } = useContext(CourseContext);
  let course = useLocalSearchParams();
  const [endDate, setEndDate] = useState(new Date(course.endDate));
  const [showDatePicker, setShowDatePicker] = useState(false);
  let weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  let n = course.weekday;
  weekdays = weekdays.filter((e, i) => (n & (1 << i) == 1));
  return (
    <SafeAreaView className='bg-primary-back h-full'>

      <Text className='bg-primary-text text-3xl text-primary-back font-serif'>{course.medicament}</Text>
      <Text className='bg-primary-text text-2xl text-primary-back font-serif'>
          Начало: {new Date(course.startDate).toLocaleDateString()}
      </Text>
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => {
          setShowDatePicker(true);
        }}
      >
      {showDatePicker && (
      <DateTimePicker
        mode="date"
        value={endDate}
        onChange={(event, selectedDate) => {
          setShowDatePicker(false);
          if (selectedDate) {
              setEndDate(selectedDate);
            }
          }
        }
      />)}
      <Text className='row-1 bg-primary-text text-2xl text-primary-back font-serif'>
        Окончание:{' '}
        <Text className='bg-primary-back text-2xl text-primary-text font-serif'>
          {' '+endDate.toLocaleDateString()+' '}
        </Text>
      </Text>
    </TouchableOpacity>

      <Text className='bg-primary-text text-2xl text-primary-back font-serif'>{weekdays.join(' ')}</Text>
      <View className='max-h-fit'>
        <ScrollView className='max-h-10:'>
        {course.schedule.split(',').map(((time, index) => (
          <Text key={index}>
            {time}
          </Text>
        )))}
      </ScrollView>
      </View>
      
      
      
      <TouchableOpacity className='bg-primary-text rounded-xl items-center justify-center' onPress={async () => {
        let newCourses = courses;
        const index = newCourses.findIndex(c => c.id = course.id);
        const oldDate = newCourses[index].endDate;
        newCourses[index].endDate = endDate;
        setCourses(newCourses);
        await saveCourses(courses);
        updateTakes(course, oldDate, endDate);
        router.back();
        }}>
        <Text className='items-center justify-center'>Сохранить изменения</Text>
      </TouchableOpacity>
    </SafeAreaView>
    
  )
}

export default ActiveCourseInfo

const styles = StyleSheet.create({})