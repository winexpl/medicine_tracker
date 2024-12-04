'use client'
import { SplashScreen, Stack } from 'expo-router';
import { useFonts  } from 'expo-font';
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../contexts/AuthContext';
import { CoursesProvider } from '../contexts/CoursesContext';
import { TakeProvider } from '../contexts/TakesContext';
import { MedicamentProvider } from '../contexts/MedicamentContext';

SplashScreen.preventAutoHideAsync(); // предотвращает скрытие асинхронности

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });
  useEffect(() => {
    if(error) throw error;
    if(fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  return (
          <AuthProvider>
            <Stack>
                <Stack.Screen name="(admin)" options={{
                  headerShown: false
                }}/>
                <Stack.Screen name="(user)" options={{
                  headerShown: false
                }}/>
                <Stack.Screen name="(auth)" options={{
                  headerShown: false
                }}/>
                <Stack.Screen name="index" options={{
                  headerShown: false
                }}/>
            </Stack>
          </AuthProvider>);
}
export default RootLayout;