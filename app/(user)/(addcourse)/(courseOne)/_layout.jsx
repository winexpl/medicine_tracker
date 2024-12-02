import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const TypeOneCourseLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="coursesOne" options={{headerShown:false}}/>
    </Stack>
  )
}

export default TypeOneCourseLayout

const styles = StyleSheet.create({})