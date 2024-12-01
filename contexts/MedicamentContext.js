import React, { createContext, useState, useContext, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import * as SecureStorage from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_GET_MEDICAMENTS } from '../constants/constants';
import axios from 'axios';
import { getToken } from './Secure';

export const MedicamentContext = createContext();


export const saveMedicaments = async ({...data}) => {
    try {
        await AsyncStorage.setItem('medicaments', JSON.stringify(data));
        console.log('Medicaments saved!');
    } catch (error) {
        console.error('Error saving takes medicaments: ', error);
    }
};

export const getMedicaments = async () => {
    try {
        const medicamentsJson = await AsyncStorage.getItem('medicaments');
        const medicamentsObj = JSON.parse(medicamentsJson);
        return Object.values(medicamentsObj);
    } catch (error) {
        console.error('Error receiving medicaments: ', error);
        return [];
    }
};

export const addMedicaments = async (data) => {
    try {
        const medicamentsJson = await AsyncStorage.getItem('medicaments');
        const medicaments = takesMedicineJson ? JSON.parse(medicamentsJson) : [];
        medicaments.push(data);
        await AsyncStorage.setItem('medicaments', JSON.stringify(medicaments));
        console.log('Medicaments added!');
    } catch (error) {
        console.error('Error adding medicaments: ', error);
    }
};

export const clearMedicaments = async (data) => {
    try {
        await AsyncStorage.deleteItemAsync('medicaments');
        console.log('Medicaments removed!');
    } catch (error) {
        console.error('Error removing medicaments: ', error);
    }
};

export const MedicamentProvider = ({ children }) => {
    const [medicaments, setMedicaments] = useState(null);
     // Загружаем курсы из AsyncStorage, если они есть
    useEffect(() => {
        async function fetchFromLocal() {
            const localMedicaments = await getMedicaments();
            setMedicaments(localMedicaments);
        }
        fetchFromLocal();
    }, []);

    useEffect(() => {
        async function fetchFromDB() {
            try {
                const response = await axios.get(API_URL_GET_MEDICAMENTS, {
                    headers: {
                        'Authorization': `Bearer ${getToken()}`,
                    },
                });

                if (response.data && response.data.length > 0) {
                    const medicamentsSaved = response.data;
                    await saveMedicaments(medicamentsSaved); // Сохраняем курсы, если запрос прошел успешно
                    // По логике здесь, перед обновлением состояния отправить локальное на сервер
                    // а то что с сервера сконкатенировать с локальным
                    setMedicaments(medicamentsSaved); // Обновляем состояние курсов
                    console.log('Medicaments fetched and saved!');
                } else {
                    console.log('No medicaments available.');
                }
            } catch (err) {
                console.error('Ошибка при получении медикаментов: ', err);
                // Попробуем получить курсы из локального хранилища, если ошибка сети
                const localMedicaments = getMedicaments();
                setMedicaments(await localMedicaments);
            }
        }
        fetchFromDB();
    }, []);
    console.log(medicaments);
    return (
        <MedicamentContext.Provider value={{medicaments, setMedicaments}}>
            {children}
        </MedicamentContext.Provider>
    );
};