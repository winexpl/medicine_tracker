import React, { createContext, useState, useContext, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import * as SecureStorage from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL_GET_MEDICAMEN } from '../constants/constants';
import axios from 'axios';
import { getToken } from './Secure';
import { CourseContext } from './CoursesContext';
import { router } from 'expo-router';

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
        await AsyncStorage.removeItem('medicaments');
        console.log('Medicaments removed!');
    } catch (error) {
        console.error('Error removing medicaments: ', error);
    }
};

export const MedicamentProvider = ({ children }) => {
    const [medicaments, setMedicaments] = useState(null);
    const { courses } = useContext(CourseContext);

    useEffect(() => {
        console.log('in medicaments',courses);
        async function fetchFromDB() {
            try {
                const newMedicaments = [];
                for(let index in courses ) {
                    const response = await axios.get(API_URL_GET_MEDICAMENT + courses[index].medicamentId, {
                        headers: {
                            'Authorization': `Bearer ${await getToken()}`,
                        },
                    });
                    const medicament = await response.data;
                    console.log(medicament);
                    newMedicaments.push(medicament);
                }
                if(newMedicaments.length > 0) {
                    setMedicaments(newMedicaments);
                    await saveMedicaments(newMedicaments);
                }
                
                console.log(medicaments);
            }
            catch (error) {
                // Попробуем получить курсы из локального хранилища, если ошибка сети
                const localMedicaments = await getMedicaments();
                setMedicaments(localMedicaments);
            }
        }
        fetchFromDB();
    }, [router, courses]);
    console.log('medicaments',medicaments);
    return (
        <MedicamentContext.Provider value={{medicaments, setMedicaments}}>
            {children}
        </MedicamentContext.Provider>
    );
};