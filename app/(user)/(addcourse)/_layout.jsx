import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

const AddCourseLayout = () => {
  return (
      <Stack>
        <Stack.Screen name="addCourse" options={{title:'Добавить курс'}}/>
    </Stack>
  )
}

export default AddCourseLayout

const styles = StyleSheet.create({})