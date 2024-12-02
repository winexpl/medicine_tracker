import { StyleSheet } from 'react-native'
import React from 'react'
import { CreateCourseProvider } from '../../../contexts/CreateCourseContext'
import { Stack } from 'expo-router'


const AddCourseLayout = () => {
  return (
    <CreateCourseProvider>
      <Stack>
        <Stack.Screen name="addCourses" options={{title:'Добавить курс'}}/>
        <Stack.Screen name="changeMedicament" options={{title:'Выбор препарата'}}/>
        <Stack.Screen name="(courseOne)" options={{title:'Выбор препарата'}}/>
      </Stack>
    </CreateCourseProvider>
  )
}

export default AddCourseLayout

const styles = StyleSheet.create({})