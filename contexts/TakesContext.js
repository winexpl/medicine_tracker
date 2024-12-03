import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_GET_TAKES, API_URL_POST_TAKES } from '../constants/constants';
import axios from 'axios';
import { getToken } from './Secure';

export const TakeContext = createContext();

export const saveTakes = async ({...data}) => {
    try {
        await AsyncStorage.setItem('takes', JSON.stringify(data));
        console.log('Take saved!');
    } catch (error) {
        console.error('Error saving takes: ', error);
    }
};

export const getTakes = async () => {
    try {
        const takesJson = await AsyncStorage.getItem('takes');
        const takesObj = JSON.parse(takesJson);
        return Object.values(takesObj);
    } catch (error) {
        console.error('Error receiving takes: ', error);
    }
};

export const addTakes = async (data) => {
    try {
        const takesJson = await AsyncStorage.getItem('takes');
        const takes = takesJson ? JSON.parse(takesJson) : [];
        takes.push(data);
        await AsyncStorage.setItem('takes', JSON.stringify(takes));
        console.log('Takes added!');
    } catch (error) {
        console.error('Error adding takes: ', error);
    }
};

export const clearTakes = async (data) => {
    try {
        await AsyncStorage.removeItem('courses');
        console.log('Courses removed!');
    } catch (error) {
        console.error('Error removing courses: ', error);
    }
};

export const TakeProvider = ({ children }) => {
    const [takes, setTakes] = useState([]);

    useEffect(() => {
        async function fetch() {
            const localTakes = await getTakes();
            setTakes(localTakes);
            if(localCourses.length > 0) {
                try {
                    const response = await axios.post(API_URL_POST_TAKES, {
                        localTakes,
                        headers: {
                            'Authorization': `${await getToken()}`,
                        },
                    });
                } catch (error) {
                    console.error('Невозможно отправить приемы на сервер: ', error);
                }
            } else {
                try {
                    const response = await axios.get(API_URL_GET_TAKES, {
                        headers: {
                            'Authorization': `Bearer ${await getToken()}`,
                        },
                    });
    
                    if (response.data && response.data.length > 0) {
                        const takesSaved = response.data;
                        await saveTakes(takesSaved); 
                        setCourses(takesSaved);
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
    }, []);

    console.log('ПРИЕМЫ',takes);
    return (
        <TakeContext.Provider value={{takes, setTakes}}>
            {children}
        </TakeContext.Provider>
    );
};