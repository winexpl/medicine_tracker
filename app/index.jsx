'use client'
import { useState, useEffect } from "react"
import {  getToken, getUserRoleFromToken } from "../context/AuthContext";
import { router } from "expo-router";

export default function App() {
    
    const [role, setRole] = useState(null); // Хранение роли пользователя
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Статус авторизации
    
    useEffect(() => {
        // Проверим токен при старте приложения
        const checkToken = async () => {
            const token = await getToken(); // Получаем токен из SecureStorage

            console.log(token);
            if (token) {
                
                const role = getUserRoleFromToken(token);
                setRole(role); // Устанавливаем роль из токена
                setIsLoggedIn(true); // Статус авторизации
                if(role === "ADMIN") router.replace('/search');
                else router.replace('/schedule');
            }
            else router.replace('/sign');
        };
        checkToken();
    }, []);
    
    
    return null;
}



