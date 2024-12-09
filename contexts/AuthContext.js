import React, { createContext, useState, useContext, useEffect } from 'react';
import {getToken} from './Secure';
const jwtDecode = require('jwt-decode');

export const AuthContext = createContext();


// Получение роли из токена, декодирование
export const getUserRoleFromToken = (token) => {
    try {
        console.log('getUserRoleFromToken', token);
        const decoded = jwtDecode(token); // Декодируем токен
        console.debug('DECODED',decoded);
        return decoded.role;
    } catch (error) {
        console.error('Ошибка декодирования токена:', error);
    }
};



export const AuthProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({role:null, isLoggedIn:false});
    
    useEffect(() => {
        async function fetch() {
            const token = await getToken();
            const role = getUserRoleFromToken(token); // Получаем роль пользователя (например, из localStorage или токена)
            setUserInfo({role:role, isLoggedIn: role? true: false});
        };
        fetch();
    }, []);
    return (
        <AuthContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </AuthContext.Provider>
    );
};
