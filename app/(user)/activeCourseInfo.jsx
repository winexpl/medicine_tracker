import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Button } from 'react-native'
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
  let selectedWeekdays = weekdays.filter((_, i) => (course.weekday & (1 << (6 - i))) !== 0);
  let per = course.period;

  return (
    <View className='bg-primary-back h-full'>
      <ScrollView>
      <Text className='text-white text-2xl'>Лекарство:</Text>
      <Text className='bg-primary-text py-4 px-4 rounded-md my-2 items-center justify-center'>   {course.medicament}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 }}>
        <Text style={{ fontSize: 26, color: 'white' }}>Доза:</Text>
        <View style={{ backgroundColor: '#FF8F00', borderRadius: 8, paddingVertical: 5, paddingHorizontal: 10, marginRight: 200 }}>
          <Text style={{ fontSize: 18, color: 'black' }}>
            {course.dose} {dosageFormTo(course.dosageForm)}
          </Text>
        </View>
      </View>

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
      <Text className='bg-primary-text py-4 px-4 rounded-md my-2 items-center justify-center'>
          Начало: {new Date(course.startDate).toLocaleDateString()}
      </Text>
      <TouchableOpacity onPress={() => {setShowDatePicker(true)}}>
        <Text className='bg-primary-text py-4 px-4 rounded-md my-2 items-center justify-center'>
          Окончание: {endDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {/* ИНУЖНО ДОБАВИТЬ ЛОГИКУ ЧТОБЫ В ЗАВИСИМОСТИ ОТ КУРСА ВЫБИРАЛОСЬ ВЫВОДИТЬ ДНИ НЕДЕЛИ ИЛИ ПЕРИОД */}
      <Text className='bg-primary-text py-4 px-4 rounded-md my-2 text items-center justify-center'>
        {course.typeCourse === '1' 
          ? `Выбранные дни недели: ${selectedWeekdays.join(' ')}`
          : course.typeCourse === '2'
          ? `Выбранная периодичность: ${per} д.`
          : 'Прием по необходимости'}
      </Text>
      {/*<Text className='bg-primary-text py-4 px-4 rounded-md my-2 text items-center justify-center'>Выбранный период: {per} д.</Text> */} 
      
        { course.schedule.length > 0 && course.schedule.split(',').map(((time, index) => (
          <View className='bg-white py-2 px-4 rounded-md my-1 justify-center'>
            <Text className="text-black" key={index}>   {index+1} прием {time}</Text>
          </View>
        )))}
      
      <TouchableOpacity className='bg-primary-text rounded-xl items-center my-2 justify-center' onPress={ async () => {
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
      </ScrollView>
    </View>
    
  )
}

export default ActiveCourseInfo

const styles = StyleSheet.create({})
