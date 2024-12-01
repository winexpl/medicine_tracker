import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context"
import { NavigationContainer } from '@react-navigation/native';
import CoursesActive from './coursesActive';
import CoursesInactive from './coursesInactive';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from '@expo/vector-icons/AntDesign';
import { MedicationForm } from '../(addcourse)/addCourse'

const Tab = createBottomTabNavigator();

const CoursesLayout = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Tab.Navigator
                    screenOptions={{
                    headerShown: false, // Скрываем стандартный заголовок
                    tabBarStyle: {
                        position: 'absolute', // Убираем из стандартного места
                        top: -11, // Перемещаем наверх
                        left: 0,
                        right: 0,
                        backgroundColor: '#1C1C2B', // Цвет панели
                    },
                    tabBarActiveTintColor: 'orange', // Цвет активного текста
                    tabBarInactiveTintColor: 'white', // Цвет неактивного текста
                    tabBarIcon: () => (
                        <AntDesign name="carryout" size={24} color="orange" />
                    ),
                }}
                
            >
                
            <Tab.Screen name="Активные" component={CoursesActive} />
            <Tab.Screen name="Завершенные" component={CoursesInactive} />
            </Tab.Navigator>
        </SafeAreaView>

    )
}

export default CoursesLayout

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1C1C2B',
        padding: 10,
    },
})