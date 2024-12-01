import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'


const CourseSelectionLayout = () => {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#1C1C2B',}, headerTintColor: '#fff', }}>
      <Stack.Screen name="addCourses" options={{ title: 'Выбор лекарства' }}/>
    </Stack>
  )
}

export default AddCourseLayout

const styles = StyleSheet.create({})