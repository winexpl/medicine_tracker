import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { CoursesProvider } from '../../contexts/CoursesContext'
import { TakeProvider } from '../../contexts/TakesContext'
import { MedicamentProvider } from '../../contexts/MedicamentContext'

const MainUserLayout = () => {
    return (
    
    <CoursesProvider>
    <TakeProvider>
    <MedicamentProvider>
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
            title:"Информацмия о курсе"
        }}/>
        </Stack>
    
    </MedicamentProvider>
    </TakeProvider>
    </CoursesProvider>
    )
}

export default MainUserLayout

const styles = StyleSheet.create({})