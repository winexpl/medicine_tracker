import React, { createContext, useState, useContext, useEffect } from 'react';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStorage from 'expo-secure-store';
import axios from 'axios';
import { API_URL_DELETE_COURSE, API_URL_GET_COURSES,
        API_URL_POST_COURSES, API_URL_PUT_COURSES, API_URL_GET_MEDICAMENT } from '../constants/constants';
import { getToken } from './Secure';
import { updateTakes } from '../components/Models';
import { deleteTakesFromCourse } from './TakesContext';
import { MedicamentContext, saveMedicaments, getMedicaments } from './MedicamentContext';

export const CourseContext = createContext();

export const saveCourses = async (data) => {
    try {
        await SecureStorage.setItem('courses', JSON.stringify(data));
        for(let i in data) {
            try {
                const response = await axios.put(API_URL_PUT_COURSES, data[i], {
                    headers: {
                        'Authorization': `Bearer ${await getToken()}`,
                        'Content-Type': 'application/json'
                    },
                });
            } catch (error) {
                console.error("Ошибка отправки нового курса на сервер: ", error);
            }
        }
        console.log('Courses saved!');
    } catch (error) {
        console.error('Error saving courses: ', error);
    }
};

export const saveDeletedCourses = async (data) => {
    try {
        await SecureStorage.setItem('deletedCourses', JSON.stringify(data));
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
        courses = await getCourses();
    } catch (error) {
        courses = [];
    }
    await deleteTakesFromCourse(data.id);
    courses = courses.filter(item => item != data);
    saveCourses(courses);
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
            deletedCourses = await getDeletedCourses();
        } catch (error) {
            console.error('Удаленные курсы пусты: ', error);
        }
        deletedCourses.push(data);
        saveDeletedCourses(deletedCourses);
    }
}

export const clearDeletedCourses = async () => {
    try {
        await SecureStorage.deleteItemAsync('deletedCourses');
        console.log('Deleted courses removed!');
    } catch (error) {
        console.error('Error removing deleted courses: ', error);
    }
};

export const getDeletedCourses = async () => {
    try {
        const coursesJson = await SecureStorage.getItem('deletedCourses');
        const coursesObj = JSON.parse(coursesJson);
        return coursesObj;
    } catch (error) {
        console.error('Error receiving courses: ', error);
        return [];
    }
};

export const getCourses = async () => {
    try {
        const coursesJson = await SecureStorage.getItem('courses');
        const coursesObj = JSON.parse(coursesJson);
        return coursesObj ? coursesObj : [];
    } catch (error) {
        console.error('Error receiving courses: ', error);
        return [];
    }
};

export const addCourses = async (data) => {
    // добавляем курс в AsyncStorage, отправляем на сервер, генерим для него приемы и отправляем на сервер
    try {
        const courses = await getCourses();
        
        courses.push(data);
        try {
            saveCourses(courses);
        } catch (error) {
            console.error('Ошибка добавления курса:', error);
            return [];
        }
        console.log('Courses added!');
        return await updateTakes(data, new Date(new Date(data.startDate).getTime() - 1000*3600*24), new Date(data.endDate), []);
    } catch (error) {
        console.error('Неизвестная ошибка при добавлении курса:', error);
        return [];
    }
};

export const clearCourses = async () => {
    try {
        await SecureStorage.deleteItemAsync('courses');
        console.log('Courses removed!', await getCourses());
    } catch (error) {
        console.error('Error removing courses: ', error);
    }
};

export const CoursesProvider = ({ children }) => {

    const [courses, setCourses] = useState([]);
    const { medicaments, setMedicaments } = useContext(MedicamentContext)
    
    useEffect(() => {
        async function fetch() {
            deleteDeletedCourses();
            const localCourses = await getCourses();
            console.log(localCourses);
            if(localCourses.length > 0) {
                setCourses(localCourses);
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
                                if(deletedCourses[i].id != item.id) return false;
                            }
                            return true;
                        });
                        console.log('СОХРАНЯЕМ КУРСЫ', coursesSaved);
                        saveCourses(coursesSaved);
                        setCourses(coursesSaved);
                        console.log('Courses fetched and saved!');
                    } else {
                        console.log('No courses available.');
                    }
                } catch (err) {
                    console.error('Нет связи с сервером, ошибка получения курсов: ', err);
                }
                console.log('УДАЛЕННЫЕ КУРСЫ', await getDeletedCourses());
            }
        }
        fetch();
    },[]);

    useEffect(() => {
        async function fetch() {
            try {
                let newMedicaments = [];
                
                for(let index in courses ) {
                    const response = await axios.get(API_URL_GET_MEDICAMENT + courses[index].medicamentId, {
                        headers: {
                            'Authorization': `Bearer ${await getToken()}`,
                        },
                    });
                    const medicament = response.data;
                    console.log(medicament);
                    newMedicaments.push(medicament);
                }
                if(newMedicaments.length > 0) {
                    setMedicaments(newMedicaments);
                    saveMedicaments(newMedicaments);
                } else {
                    const localMedicaments = await getMedicaments();
                    setMedicaments(localMedicaments);
                }
            }
            catch (error) {
                // Попробуем получить курсы из локального хранилища, если ошибка сети
                console.error('Невозможно получить медикаменты с сервера: ', error);
                const localMedicaments = await getMedicaments();
                setMedicaments(localMedicaments);
            }
            console.log('МЕДИКАМЕНТЫ', medicaments);
        }
        fetch();
    }, [courses])
    console.log('КУРСЫ', courses);
    
    return (
        <CourseContext.Provider value={{ courses, setCourses }}>
            {children}
        </CourseContext.Provider>
    );
};