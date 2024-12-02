import { useState, useEffect, useContext } from "react";
import { router } from "expo-router";
import { getUserRoleFromToken, AuthContext } from "../contexts/AuthContext";
import { saveToken, getToken, removeToken } from "../contexts/Secure";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native";

export default function App() {
    
    const { userInfo, setUserInfo } = useContext(AuthContext);
    
    
    useEffect(() => {
        console.log('ВЫЗЫВАЕМ USEEFFECT');
        async function name() {
            console.log('asdasd', userInfo.role);
            if(userInfo.role === "ADMIN") {
                console.log('ПЕРЕХОД В /SEARCH');
                router.replace('/search');
            }
            else if(userInfo.role === "USER") {
                console.log('ПЕРЕХОД В /schedule');
                router.replace('/(tabsuser)/schedule');
            }
            else if(!userInfo.role) {
                console.log('ПЕРЕХОД В /SIGN');
                router.replace('/sign');
            }
        }
        name();
    });
    
    return (
        <SafeAreaView>
        </SafeAreaView>
    );
}



