import React, { createContext, useState, useContext, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getToken} from './Secure';

export const AuthContext = createContext();


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



export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({role:null, isLoggedIn:false});
    const token = getToken();
    console.log('AuthProvider: ' + token);
    const role = getUserRoleFromToken(token); // Получаем роль пользователя (например, из localStorage или токена)
    useEffect(() => {
        setUserInfo({role:role, isLoggedIn: role? true: false});
    }, []);
    return (
        <AuthContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </AuthContext.Provider>
    );
};
