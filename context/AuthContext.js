import React, { createContext, useState, useContext, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import * as SecureStorage from 'expo-secure-store';


const AuthContext = createContext();

// Получение роли из токена, декодирование
export const getUserRoleFromToken = (token) => {
    try {
        const decoded = jwt_decode(token); // Декодируем токен
        console.log(decoded);
        return decoded.role; // Роль пользователя обычно находится в payload
    } catch (error) {
        console.error('Ошибка декодирования токена:', error);
        return null;
    }
};

// Сохранение токена в хранилище
export const saveToken = async (token) => {
    try {
        await SecureStorage.setItemAsync('token', token);
        console.log('Token saved successfully');
    } catch (error) {
        console.error('Error saving token:', error);
    }
};

// Удаление токена их хранилища
export const removeToken = async () => {
    try {
        await SecureStorage.deleteItemAsync('token');
        console.log('Token removed successfully');
    } catch (error) {
        console.error('Error removing token:', error);
    }
};

// Получение токена из хранилища
export const getToken = async () => {
    try {
        const token = await SecureStorage.getItemAsync('token');
        return token;
    } catch (error) {
        console.error('Ошибка получения токена:', error);
        return null;
    }
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [userRole, setUserRole] = useState(null);
        const role = getUserRoleFromToken(getToken()); // Получаем роль пользователя (например, из localStorage или токена)
        useEffect(() => {
            setUserRole(role);
        }, []);

    return (
        <AuthContext.Provider value={{ userRole, setUserRole }}>
            {children}
        </AuthContext.Provider>
    );
};