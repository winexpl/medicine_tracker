import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams } from 'expo-router'
import { router } from 'expo-router';
import { clearCourses, CourseContext, deleteCourses, saveCourses } from '../../contexts/CoursesContext';
import { updateTakes } from '../../components/Models';
import { saveTakes, TakeContext } from '../../contexts/TakesContext';
import axios from 'axios';

const InactiveCourseInfo = () => {
    let course = useLocalSearchParams();
    const { courses, setCourses } = useContext(CourseContext);

    let weekdays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    let n = course.weekday;
    weekdays = weekdays.filter((e, i) => (n & (1 << i) == 1));
    return (
        <View className='bg-primary-back h-full'>
        <Text className='text-white text-2xl'>Лекарство:</Text>
        <Text className='bg-primary-text py-4 px-4 rounded-md my-2 items-center justify-center'>{course.medicament}</Text>
        <Text className='bg-primary-text py-4 px-4 rounded-md my-2 items-center justify-center'>
            Начало: {new Date(course.startDate).toLocaleDateString()}
        </Text>
        <Text className='bg-primary-text py-4 px-4 rounded-md my-2 items-center justify-center'>
            Завершение: {new Date(course.endDate).toLocaleDateString()}
        </Text>

        {/*ТУТ НИЧЕГО НЕ ВЫВОДИТ Я НЕ ПОНИМАЮ ЧТО ЭТО <Text className='bg-primary-text py-4 px-4 rounded-md my-2 items-center justify-center'>{weekdays.join(' ')}</Text> */}
        {course.schedule.split(',').map(((time, index) => (
            <View className='bg-gray-200 py-2 px-4 rounded-md my-1 justify-center'>
                <Text className="text-black" key={index}>   {index+1} прием {time}</Text>
            </View>
        )))}
        <TouchableOpacity className='bg-primary-text my-2 rounded-xl items-center justify-center' onPress={ () => {
            let newCourses = [...courses];
            let indexToRemoved = newCourses.findIndex(c => c.id === course.id);
            newCourses.splice(indexToRemoved, 1);
            setCourses(newCourses);
            saveCourses(newCourses);
            deleteCourses(course);
            router.back();
            }}>
            <Text className='bg-primary-text py-4 px-4 rounded-md my-2 justify-center'>Удалить курс</Text>
        </TouchableOpacity>
        </View>
        
    )
}

export default InactiveCourseInfo

const styles = StyleSheet.create({})