import { StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'


const AddCourseLayout = () => {
  return (
    <Stack>
        <Stack.Screen name="addCourse" options={{title:'Добавить курс'}}/>
        <Stack.Screen name="changeMedicament" options={{title:'Выбор препарата'}}/>
        <Stack.Screen name="addCourseWithPeriod" options={{headerShown:false}}/>
      </Stack>
  )
}

export default AddCourseLayout

const styles = StyleSheet.create({})