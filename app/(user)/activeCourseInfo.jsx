import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Button } from 'react-native'
import React, { useContext, useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { CourseContext, saveCourses } from '../../contexts/CoursesContext';
import { dosageFormTo, updateTakes } from '../../components/Models';
import { addDeletedTakes, saveTakes, TakeContext } from '../../contexts/TakesContext';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';

const ActiveCourseInfo = () => {
  let course = useLocalSearchParams();
  const { courses, setCourses } = useContext(CourseContext);
  const { takes, setTakes } = useContext(TakeContext);
  const [ endDate, setEndDate ] = useState(new Date(course.endDate));
  const [ oldDate, setOldDate ] = useState(new Date(course.endDate));
  const [ showDatePicker, setShowDatePicker] = useState(false);
  const [ state, setState ] = useState(true);
  
  async function setAll() {
    let newCourses = [...courses];
    const index = newCourses.findIndex(c => c.id === course.id);
    newCourses[index].endDate = endDate;
    setCourses(newCourses);
    saveCourses(newCourses);
    const newTakes = await updateTakes(course, oldDate, endDate, takes);
    setOldDate(newCourses[index].endDate);
    saveTakes([...newTakes]);
    setTakes([...newTakes]);
    router.push('schedule');
  }

  let weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  let n = course.weekday;
  weekdays = weekdays.filter((e, i) => (n & (1 << 6-i) == 1));
  return (
    <View className='bg-primary-back h-full'>
      <Text className='text-white text-2xl'>Лекарство:</Text>
      <Text className='bg-primary-text py-4 px-4 rounded-md my-2 items-center justify-center'>   {course.medicament}</Text>
      <Text className="bg-primary-text py-4 px-4 rounded-md my-2 items-center justify-center">   Доза: {course.dose} {dosageFormTo(course.dosageForm)}</Text>
      <Text className='bg-primary-text py-4 px-4 rounded-md my-2 items-center justify-center'>   Начало: {new Date(course.startDate).toLocaleDateString()}</Text>
      <TouchableOpacity
        className="bg-primary-text py-1 px-4 rounded-md my-2 justify-center"
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
      <Text className='bg-primary-text py-1 px-4 rounded-md my-2 items-center justify-center'>
        Окончание: {endDate.toLocaleDateString()}
      </Text>
    </TouchableOpacity>

      <View className='bg-primary-text py-4 px-4 rounded-md my-2 justify-center'>
        <ScrollView className='max-h-10:'>
        {course.schedule.split(',').map(((time, index) => (
          <Text className="text-black" key={index}>   {index+1} прием {time}</Text>
        )))}
      </ScrollView>
      </View>
      <TouchableOpacity className='bg-primary-text rounded-xl items-center justify-center' onPress={ async () => {
          console.log('НАЖАТА')
          setAll();
        }}>
        <Text className='bg-primary-text py-4 px-4 rounded-md my-2 justify-center'>Сохранить изменения</Text>
      </TouchableOpacity>

      <TouchableOpacity className='bg-primary-text rounded-xl items-center my-2 justify-center' onPress={ () => {
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
        let index = newCourses.findIndex(c => c.id === course.id);
        newCourses[index].state = "Завершенный";
        newCourses[index].endDate = new Date().toLocaleDateString("en-CA"),
        setCourses(newCourses);
        saveCourses(newCourses);
        router.back();
        }}>
        <Text className='bg-primary-text py-4 px-4 rounded-md my-2 text-center justify-center'>Завершить курс</Text>
      </TouchableOpacity>
    </View>
    
  )
}

export default ActiveCourseInfo

const styles = StyleSheet.create({})