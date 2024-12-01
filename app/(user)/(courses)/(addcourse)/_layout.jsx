import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const AddCourseLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="addCourse"/>
    </Stack>
  )
}

export default AddCourseLayout

const styles = StyleSheet.create({})