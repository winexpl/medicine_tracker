import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_DELETE_COURSE, API_URL_GET_TAKES, API_URL_POST_TAKES } from '../constants/constants';
import axios from 'axios';
import { getToken } from './Secure';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export const TakeContext = createContext();


export const saveDeletedTakes = async (data) => {
    try {
        await AsyncStorage.setItem('deletedTakes', JSON.stringify(data));
        console.log('Deleted take saved!');

    } catch (error) {
        console.error('Error saving deleted takes: ', error);
    }
};

export const addDeletedTake = async (data) => {
    try {
        const storedData = await AsyncStorage.getItem('deletedTakes');
        const deletedTakes = storedData ? JSON.parse(storedData) : [];
        deletedTakes.push(...data);
        console.log('123qweadasd ',deletedTakes);
        await AsyncStorage.setItem('deletedTakes', JSON.stringify(deletedTakes));
    } catch (error) {
        console.error("Error adding deleted takes:", error);
    }
};

export const getDeletedTakes = async () => {
    try {
        const deletedTakesJson = await AsyncStorage.getItem('deletedTakes');
        const deletedTakes = JSON.parse(deletedTakesJson);
        return deletedTakes;
    } catch (error) {
        console.error('Error receiving deleted takes:', error);
    }
};

export const removeDeletedTakes = async (itemsToRemove) => {
    try {
        const storedData = await AsyncStorage.getItem('deletedTakes');
        if (!storedData) {
            return;
        }
        const deletedTakes = JSON.parse(storedData);
        const updatedDeletedTakes = deletedTakes.filter(item => {
            return !itemsToRemove.some(removeItem => removeItem.id === item.id);
        });
        await AsyncStorage.setItem('deletedTakes', JSON.stringify(updatedDeletedTakes));
    } catch (error) {
        console.error("Error removing deleted takes:", error);
    }
};

export const saveTakes = async ({...data}) => {
    try {
        await AsyncStorage.setItem('takes', JSON.stringify(data));
        console.log('Take saved!');
        try {
            const response = await axios.post(API_URL_POST_TAKES, Object.values(data),{
                headers: {
                    'Authorization': `Bearer ${await getToken()}`,
                    'Content-Type': 'application/json'
                },
            });
        } catch (error) {
            console.error('Невозможно отправить приемы на сервер: ', error.response);
        }
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
            saveTakes([]);
            const localTakes = await getTakes();
            setTakes(localTakes);
            const deletedTakes = await getDeletedTakes();
            const realDeletedTakes = [];
            for(let i = 0; i < deletedTakes.length; i++) {
                try {
                    const response = await axios.delete(API_URL_DELETE_COURSE + deletedTakes[i].id, {
                        headers: {
                            'Authorization': `Bearer ${await getToken()}`,
                        },
                    })
                    realDeletedTakes.push(deletedTakes[i]);
                } catch (error) {
                    console.error('Невозможно удалить прием:', error);
                }
            }
            removeDeletedTakes(realDeletedTakes);
            console.log('УДАЛЕННЫЕ ПРИЕМЫ',await getDeletedTakes());
            if(localTakes.length > 0) {
                try {
                    const response = await axios.post(API_URL_POST_TAKES, localTakes, {
                        headers: {
                            'Authorization': `Bearer ${await getToken()}`,
                            'Content-Type': 'application/json'
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
                        setTakes(takesSaved);
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