import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router'

const ActiveCourseInfo = () => {
  const course = useLocalSearchParams();
  return (
    <SafeAreaView>
      // красиво вывести все
      <Text>{course.id}</Text>
      
      <TouchableOpacity>
      
      </TouchableOpacity>
    </SafeAreaView>
    
  )
}

export default ActiveCourseInfo

const styles = StyleSheet.create({})