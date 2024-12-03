import { StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'


const AddCourseLayout = () => {
  return (
      <Stack>
        <Stack.Screen name="addCourses" options={{title:'Добавить курс'}}/>
        <Stack.Screen name="changeMedicament" options={{title:'Выбор препарата'}}/>
        <Stack.Screen name="(courseOne)" options={{title:'Выбор препарата'}}/>
      </Stack>
  )
}

export default AddCourseLayout

const styles = StyleSheet.create({})