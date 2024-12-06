import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL_DELETE_COURSE, API_URL_GET_COURSES, API_URL_POST_COURSES, API_URL_PUT_COURSES } from '../constants/constants';
import { getToken } from './Secure';
import { updateTakes } from '../components/Models';
import { deleteTakesFromCourse } from './TakesContext';

export const CourseContext = createContext();

export const saveCourses = async ({...data}) => {
    try {
        await AsyncStorage.setItem('courses', JSON.stringify(data));
        console.log('Courses saved!');
    } catch (error) {
        console.error('Error saving courses: ', error);
    }
};

export const saveDeletedCourses = async (data) => {
    try {
        await AsyncStorage.setItem('deletedCourses', JSON.stringify(data));
        console.log('Deleted courses saved!');
    } catch (error) {
        console.error('Error saving deleted courses: ', error);
    }
};

export const deleteDeletedCourses = async () => {
    // удаляет на сервере те которые есть в хранилище удаленных
    let deletedCourses = await getDeletedCourses();
    let newDeletedCourses = [];
    for(i in deletedCourses) {
        await deleteTakesFromCourse(deletedCourses[i].id);
        try {
            const response = await axios.delete(
                `${API_URL_DELETE_COURSE}${deletedCourses[i].id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${await getToken()}`,
                    },
                }
            );
        } catch (error) {
            console.error('Невозможно удалить курс: ', error);
            newDeletedCourses.push(deletedCourses[i]);
        }
    }
    saveDeletedCourses(newDeletedCourses);
}

export const deleteCourses = async (data) => {
    // удаляет переданный курс
    let courses = [];
    try {
        const coursesJson = await AsyncStorage.getItem('courses');
        const coursesObj = JSON.parse(coursesJson);
        courses = Object.values(coursesObj);
    } catch (error) {
        courses = [];
        console.error('Error receiving courses: ', error);
    }
    await deleteTakesFromCourse(data.id);
    courses = courses.filter(item => item != data);
    await AsyncStorage.setItem('courses', JSON.stringify({...courses}));
    try {
        const response = await axios.delete(
            `${API_URL_DELETE_COURSE}${data.id}`,
            {
                headers: {
                    'Authorization': `Bearer ${await getToken()}`,
                },
            }
        );
    } catch (error) {
        console.error('Ошибка удаления курса: ', error.response, data.id);
        let deletedCourses = [];
        try {
            deletedCourses = JSON.parse(await AsyncStorage.getItem('deletedCourses'));
        } catch (error) {
            console.error('Удаленные курсы пусты: ', error);
        }
        deletedCourses.push(data);
        saveDeletedCourses(deletedCourses);
    }
    saveCourses(courses);
}

export const clearDeletedCourses = async () => {
    try {
        await AsyncStorage.removeItem('deletedCourses');
        console.log('Deleted courses removed!');
    } catch (error) {
        console.error('Error removing deleted courses: ', error);
    }
};

export const getDeletedCourses = async () => {
    try {
        const coursesJson = await AsyncStorage.getItem('deletedCourses');
        const coursesObj = JSON.parse(coursesJson);
        return coursesObj;
    } catch (error) {
        console.error('Error receiving courses: ', error);
        return [];
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

export const addCourses = async (data, takes) => {
    // добавляем курс в AsyncStorage, отправляем на сервер, генерим для него приемы и отправляем на сервер
    try {
        const coursesJson = await AsyncStorage.getItem('courses');
        const courses = coursesJson ? Object.values(JSON.parse(coursesJson)) : [];
        courses.push(data);
        console.debug('added', data, courses);
        saveCourses(courses);
        console.log('Courses added!');
        try {
            const response = await axios.put(API_URL_PUT_COURSES, data, {
                headers: {
                    'Authorization': `Bearer ${await getToken()}`,
                    'Content-Type': 'application/json'
                },
            });
        } catch (error) {
            console.error("Ошибка отправки нового курса на сервер: ", error);
        }
        return await updateTakes(data, new Date(new Date(data.startDate).getTime() - 1000*3600*24), new Date(data.endDate), takes);
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
            deleteDeletedCourses();
            const localCourses = await getCourses();
            setCourses(localCourses);
            console.log(localCourses);
            if(localCourses.length > 0) {
                for(let i = 0; i < localCourses.length; i++) {
                    try {
                        const response = await axios.put(API_URL_POST_COURSES , localCourses[i], {
                            headers: {
                                'Authorization': `Bearer ${await getToken()}`,
                                'Content-Type': 'application/json'
                            },
                        });
                    } catch (error) {
                        console.error('Error:', error.response);
                    }
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
                        let coursesSaved = response.data;
                        const deletedCourses = await getDeletedCourses();
                        coursesSaved = coursesSaved.filter(item => {
                            for(let i in deletedCourses) {
                                if(deletedCourses[i].id === item.id) return true;
                            }
                            return false;
                        });
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
            console.log('УДАЛЕННЫЕ КУРСЫ', await getDeletedCourses());
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