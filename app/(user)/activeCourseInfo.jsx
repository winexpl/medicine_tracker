import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { CourseContext, saveCourses } from '../../contexts/CoursesContext';
import { dosageFormTo, updateTakes } from '../../components/Models';
import { addDeletedTakes, saveTakes, TakeContext } from '../../contexts/TakesContext';

const ActiveCourseInfo = () => {
  let course = useLocalSearchParams();
  const { courses, setCourses } = useContext(CourseContext);
  const { takes, setTakes } = useContext(TakeContext);
  const [endDate, setEndDate] = useState(new Date(course.endDate));
  const [oldDate, setOldDate] = useState(new Date(course.endDate));
  const [showDatePicker, setShowDatePicker] = useState(false);
  

  useEffect(() => {
    async function set() {
      console.log('newTakes1', takes);
      let newCourses = [...courses];
      const index = newCourses.findIndex(c => c.id === course.id);
      newCourses[index].endDate = endDate;
      setCourses(newCourses);
      saveCourses(newCourses);
      const newTakes = await updateTakes(course, oldDate, endDate, takes);
      setOldDate(newCourses[index].endDate);
      console.log('newTakes2', takes);
      saveTakes([...takes, ...newTakes]);
      setTakes([...takes, ...newTakes]);
      console.log('newTakes3', takes);
    }
    set();
  }, [endDate])

  let weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  let n = course.weekday;
  weekdays = weekdays.filter((e, i) => (n & (1 << i) == 1));
  return (
    <SafeAreaView className='bg-primary-back h-full'>

      <Text className='bg-primary-text text-3xl text-primary-back font-serif'>{course.medicament}</Text>
      <Text>Доза: {course.dose} {dosageFormTo(course.dosageForm)}</Text>
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
        Окончание: {endDate.toLocaleDateString()}
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
      
      
      
      <TouchableOpacity className='bg-primary-text rounded-xl items-center justify-center' onPress={ () => {
        router.back();
        }}>
        <Text className='items-center justify-center text-2xl'>Сохранить изменения</Text>
      </TouchableOpacity>

      <TouchableOpacity className='bg-primary-text rounded-xl items-center justify-center' onPress={ () => {
        // просто поменять состояение курса
        // удалить все его приемы которые дальше текущей даты

        // находим приемы курса которые надо удалить
        let deletedTakes = [];
        let newTakes = [];
        for(let i in takes) {
          if(takes[i].courseId === course.id && new Date(takes[i].datetime) > new Date()) {
            deletedTakes.push(takes[i]);
          } else {
            newTakes.push(takes[i])
          }
        }
        setTakes(newTakes);
        saveTakes(newTakes);
        console.log('deletedTakes', deletedTakes);
        // удаляем
        addDeletedTakes(deletedTakes);
        let newCourses = [...courses];
        newCourses[newCourses.findIndex(c => c.id === course.id)].state = "Завершенный";
        setCourses(newCourses);
        saveCourses(newCourses);
        router.back();
        }}>
        <Text className='items-center justify-center text-2xl'>Завершить курс</Text>
      </TouchableOpacity>
    </SafeAreaView>
    
  )
}

export default ActiveCourseInfo

const styles = StyleSheet.create({})