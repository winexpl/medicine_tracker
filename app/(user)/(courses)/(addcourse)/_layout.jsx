import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AddCourseLayout = () => {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: '#1C1C2B',}, headerTintColor: '#fff', }}>
      <Stack.Screen name="(addCourse)" options={{ title: 'Выбор курса' }}/>
      <Stack.Screen name="(courseSelection)" options={{ title: 'Выбор курса' }}/>
    </Stack>
  )
}

export default AddCourseLayout

const styles = StyleSheet.create({})