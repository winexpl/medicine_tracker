import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from "react-native-safe-area-context"
import { NavigationContainer } from '@react-navigation/native';
import CoursesActive from './coursesActive';
import CoursesInactive from './coursesInactive';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from '@expo/vector-icons/AntDesign';
import { CoursesProvider } from '../../../../contexts/CoursesContext';

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
                        backgroundColor: '#403a3a', // Цвет панели
                    },
                    tabBarActiveTintColor: '#42aaff', // Цвет активного текста
                    tabBarInactiveTintColor: 'white', // Цвет неактивного текста
                    tabBarIcon: () => (
                        <AntDesign name="carryout" size={24} color="#42aaff" />
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
        backgroundColor: '#403a3a',
        padding: 10,
    },
})