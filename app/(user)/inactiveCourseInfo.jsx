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
        <SafeAreaView className='bg-primary-back h-full'>

        <Text className='bg-primary-text text-3xl text-primary-back font-serif'>{course.medicament}</Text>
        <Text className='bg-primary-text text-2xl text-primary-back font-serif'>
            Начало: {new Date(course.startDate).toLocaleDateString()}
        </Text>
        <Text className='bg-primary-text text-2xl text-primary-back font-serif'>
            Завершение: {new Date(course.endDate).toLocaleDateString()}
        </Text>

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
            let newCourses = [...courses];
            let indexToRemoved = newCourses.findIndex(c => c.id === course.id);
            newCourses.splice(indexToRemoved, 1);
            setCourses(newCourses);
            saveCourses(newCourses);
            deleteCourses(course);
            router.back();
            }}>
            <Text className='text-2xl items-center justify-center'>Удалить курс</Text>
        </TouchableOpacity>
        </SafeAreaView>
        
    )
}

export default InactiveCourseInfo

const styles = StyleSheet.create({})