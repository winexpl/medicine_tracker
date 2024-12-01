import React, { createContext, useState, useContext, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import * as SecureStorage from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_GET_TAKEMEDICINE } from '../constants/constants';
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
        if(takesJson != null) {
            return JSON.parse(takesJson);
        } else console.log('Takes is null');
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
        await AsyncStorage.deleteItemAsync('courses');
        console.log('Courses removed!');
    } catch (error) {
        console.error('Error removing courses: ', error);
    }
};

export const TakeProvider = ({ children }) => {
    const [takes, setTakes] = useState(null);

    // Загружаем курсы из AsyncStorage, если они есть
    useEffect(() => {
        async function fetchFromLocal() {
            const localTakes = await getTakes();
            setCourses(localTakes);
        }
        fetchFromLocal();
    }, []);

    // Загружаем курсы с сервера
    useEffect(() => {
        async function fetchCourses() {
            try {
                const response = await axios.get(API_URL_GET_TAKEMEDICINE, {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`,
                    },
                });

                if (response.data && response.data.length > 0) {
                    const takesSaved = response.data;
                    await saveTakes(takesSaved); // Сохраняем курсы, если запрос прошел успешно
                    // По логике здесь, перед обновлением состояния отправить локальное на сервер
                    // а то что с сервера сконкатенировать с локальным
                    setTakes(takesSaved); // Обновляем состояние курсов
                    console.log('Takes fetched and saved!');
                } else {
                    console.log('No takes available.');
                }
            } catch (err) {
                console.error('Ошибка при получении приемов: ', err);
                // Попробуем получить курсы из локального хранилища, если ошибка сети
                const localTakes = getTakes();
                setTakes(await localTakes);
            }
        }

        fetchCourses();
    }, []);
    console.log(takes);
    return (
        <TakeContext.Provider value={{takes, setTakes}}>
            {children}
        </TakeContext.Provider>
    );
};