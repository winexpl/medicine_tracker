import React, { createContext, useState, useContext, useEffect } from 'react';
//import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStorage from 'expo-secure-store';
import { API_URL_GET_MEDICAMENT, API_URL_POST_MEDICAMENTS } from '../constants/constants';
import axios from 'axios';
import { getToken } from './Secure';
import { CourseContext } from './CoursesContext';
import { router } from 'expo-router';
import { getUserRoleFromToken } from './AuthContext';

export const MedicamentContext = createContext();

export const saveMedicaments = async ([...data]) => {
    try {
        await SecureStorage.setItem('medicaments', JSON.stringify(data));
        console.log('Medicaments saved!');
    } catch (error) {
        console.error('Error saving takes medicaments: ', error);
    }
};

export const getMedicaments = async () => {
    try {
        const medicamentsJson = await SecureStorage.getItem('medicaments');
        const medicamentsObj = JSON.parse(medicamentsJson);
        return medicamentsObj ? medicamentsObj : [];
    } catch (error) {
        console.error('Error receiving medicaments: ', error);
        return [];
    }
};

export const addMedicaments = async (data) => {
    try {
        const medicaments = await getMedicaments();
        medicaments.push(data);
        await SecureStorage.setItem('medicaments', JSON.stringify(medicaments));
        console.log('Medicaments added!');
    } catch (error) {
        console.error('Error adding medicaments: ', error);
    }
};

export const clearMedicaments = async () => {
    try {
        await SecureStorage.deleteItemAsync('medicaments');
        console.log('Medicaments removed!');
    } catch (error) {
        console.error('Error removing medicaments: ', error);
    }
};

export const MedicamentProvider = ({ children }) => {
    const [medicaments, setMedicaments] = useState([]);

    useEffect(() => {
        async function fetchFromDB() {

        }
        fetchFromDB();
    }, []);

    console.log('МЕДИКАМЕНТЫ', medicaments);
    return (
        <MedicamentContext.Provider value={{medicaments, setMedicaments}}>
            {children}
        </MedicamentContext.Provider>
    );
};