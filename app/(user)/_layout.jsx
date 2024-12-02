import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const MainUserLayout = () => {
    return (
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
    </Stack>
    )
}

export default MainUserLayout

const styles = StyleSheet.create({})