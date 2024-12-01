import React, { createContext, useState, useContext, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import * as SecureStorage from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL_GET_COURSES } from '../constants/constants';
import { getToken } from './Secure';

export const CourseContext = createContext();


export const saveCourses = async ({...data}) => {
    try {
        await AsyncStorage.setItem('courses', JSON.stringify(data));
        console.log('Courses saved!');
    } catch (error) {
        console.error('Error saving courses: ', error);
    }
};

export const getCourses = async () => {
    try {
        const coursesJson = await AsyncStorage.getItem('courses');
        const coursesObj = JSON.parse(coursesJson);
        return Object.values(coursesObj);
    } catch (error) {
        console.error('Error receiving courses: ', error);
        return [];
    }
};

export const addCourses = async (data) => {
    try {
        const coursesJson = await AsyncStorage.getItem('courses');
        const courses = coursesJson ? JSON.parse(coursesJson) : [];
        courses.push(data);
        await AsyncStorage.setItem('courses', JSON.stringify(courses));
        console.log('Courses added!');
    } catch (error) {
        console.error('Error adding courses: ', error);
    }
};

export const clearCourses = async () => {
    try {
        await AsyncStorage.deleteItemAsync('courses');
        console.log('Courses removed!');
    } catch (error) {
        console.error('Error removing courses: ', error);
    }
};

export const CoursesProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    if(Array.isArray(courses)) console.log('Array');
    else console.log('No array');


     // Загружаем курсы из AsyncStorage, если они есть
    useEffect(() => {
        async function fetchFromLocal() {
            const localCourses = await getCourses();
            setCourses(localCourses);
        }
        fetchFromLocal();
    }, []);

    // Загружаем курсы с сервера
    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await axios.get(API_URL_GET_COURSES, {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`,
                    },
                });

                if (response.data && response.data.length > 0) {
                    const coursesSaved = response.data;
                    await saveCourses(coursesSaved); // Сохраняем курсы, если запрос прошел успешно
                    // По логике здесь, перед обновлением состояния отправить локальное на сервер
                    // а то что с сервера сконкатенировать с локальным
                    setCourses(coursesSaved); // Обновляем состояние курсов
                    console.log('Courses fetched and saved!');
                } else {
                    console.log('No courses available.');
                }
            } catch (err) {
                console.error('Ошибка при получении курсов: ', err);
                // Попробуем получить курсы из локального хранилища, если ошибка сети
                const localCourses = await getCourses();
                setCourses(localCourses);
            }
        }

        fetchCourses();
    }, []);

    console.log(courses);
    
    return (
        <CourseContext.Provider value={{ courses, setCourses }}>
            {children}
        </CourseContext.Provider>
    );
};