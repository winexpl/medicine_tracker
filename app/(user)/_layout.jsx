import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { CoursesProvider } from '../../contexts/CoursesContext'
import { TakeProvider } from '../../contexts/TakesContext'
import { MedicamentProvider } from '../../contexts/MedicamentContext'

// PushNotification.configure({
//     onNotification: function(notification) {
//         console.log('Получено уведомление:', notification);
//     },
//     requestPermissions: true,  // Запрашиваем разрешения на iOS
// });
const MainUserLayout = () => {
    // const notificationTime = new Date();
    // notificationTime.setSeconds(notificationTime.getSeconds() + 10);  // Уведомление через 10 секунд

    // PushNotification.localNotificationSchedule({
    //     title: 'Время принимать лекарства!',
    //     message: 'Не забудьте принять свой препарат.',
    //     date: notificationTime,  // Время отправки уведомления
    // });
    return (
    <MedicamentProvider>
    <CoursesProvider>
    <TakeProvider>
    
        <Stack>
        <Stack.Screen name="(tabsuser)" options={{
            headerShown: false
        }}/>
        <Stack.Screen name="addTake" options={{
            title:'Добавить прием'
        }}/>
        <Stack.Screen name="(addcourse)" options={{
            headerShown: false
        }}/>
        <Stack.Screen name="activeCourseInfo" options={{
            title:"Информация о курсе"
        }}/>
        <Stack.Screen name="inactiveCourseInfo" options={{
            title:"Информация о курсе"
        }}/>
        </Stack>
    
    
    </TakeProvider>
    </CoursesProvider>
    </MedicamentProvider>
    )
}

export default MainUserLayout

const styles = StyleSheet.create({})