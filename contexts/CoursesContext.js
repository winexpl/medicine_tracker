import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL_GET_COURSES, API_URL_POST_COURSES } from '../constants/constants';
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
        await AsyncStorage.removeItem('courses');
        console.log('Courses removed!', await getCourses());
    } catch (error) {
        console.error('Error removing courses: ', error);
    }
};

export const CoursesProvider = ({ children }) => {

    const [courses, setCourses] = useState([]);
    
    useEffect(() => {
        async function fetch() {
            const localCourses = await getCourses();
            setCourses(localCourses);
            if(localCourses.length > 0) {
                try {
                    const response = await axios.post(API_URL_GET_COURSES, courses, {
                        headers: {
                            'Authorization': `Bearer ${await getToken()}`,
                            'Content-Type': 'application/json'
                        },
                    });
                    console.log(response);
                } catch (error) {
                    console.error('Error:', error.response ? error.response.data : error.message);
                }
            }
            else {
                try {
                    const response = await axios.get(API_URL_GET_COURSES, {
                        headers: {
                            'Authorization': `Bearer ${await getToken()}`,
                        },
                    });
    
                    if (response.data && response.data.length > 0) {
                        const coursesSaved = response.data;
                        await saveCourses(coursesSaved); 
                        setCourses(coursesSaved);
                        console.log('Courses fetched and saved!');
                    } else {
                        console.log('No courses available.');
                    }
                } catch (err) {
                    console.error('Нет связи с сервером, ошибка получения курсов: ', err);
                }
            }
        }
        fetch();
    },[]);

    console.log('КУРСЫ', courses);
    
    return (
        <CourseContext.Provider value={{ courses, setCourses }}>
            {children}
        </CourseContext.Provider>
    );
};