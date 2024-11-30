import React, { createContext, useState, useContext, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import * as SecureStorage from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        if(coursesJson != null) {
            return JSON.parse(coursesJson);
        } else {
            console.log('Courses is null');
            return null;
        }
    } catch (error) {
        console.error('Error receiving courses: ', error);
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

export const clearCourses = async (data) => {
    try {
        await AsyncStorage.deleteItemAsync('courses');
        console.log('Courses removed!');
    } catch (error) {
        console.error('Error removing courses: ', error);
    }
};



export const CoursesProvider = ({ children }) => {
    const [courses, setCourses] = useState(null);
    useEffect(() => {
        setCourses(getCourses());
    }, []);
    return (
        <CourseContext.Provider value={{ courses, setCourses }}>
            {children}
        </CourseContext.Provider>
    );
};