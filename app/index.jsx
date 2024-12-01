import { useState, useEffect, useContext } from "react";
import { router } from "expo-router";
import { getUserRoleFromToken, AuthContext } from "../contexts/AuthContext";
import { saveToken, getToken, removeToken } from "../contexts/Secure";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";

export default function App() {
    
    const {userInfo, setUserInfo} = useContext(AuthContext);

    useEffect(() => {
        // Проверим токен при старте приложения
        const checkToken = async () => {
            let token = null;
            try {
                console.log('its index');
                token = await getToken(); // Получаем токен из SecureStorage
                console.log('in index: ' + token);
            } catch (error) {
                console.log('ОШИБКА ', error);
            } finally {
                if (token) {
                    const role = getUserRoleFromToken(token);
                    setUserInfo({role:role, isLoggedIn:true});
                    if(role === "ADMIN") router.replace('/search');
                    else {
                        console.log('ПЕРЕХОД В /schedule');
                        router.replace('/schedule');
                    }
                }
                else {
                    console.log('ПЕРЕХОД В /SIGN');
                    router.replace('/sign');
                }
            }
        };
        checkToken();
    });
    
    return (
        <SafeAreaView>
            <Text>ЖОПА!</Text>
            <Text>ЖОПА!</Text>
            <Text>ЖОПА!</Text>
            <Text>ЖОПА!</Text>
            <Text>ЖОПА!</Text>
            <Text>ЖОПА!</Text>
            <Text>ЖОПА!</Text>
        </SafeAreaView>
    );
}



