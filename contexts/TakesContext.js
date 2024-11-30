import React, { createContext, useState, useContext, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import * as SecureStorage from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    useEffect(() => {
        setTakes(getTakes());
    }, []);
    return (
        <TakeContext.Provider value={{takes, setTakes}}>
            {children}
        </TakeContext.Provider>
    );
};