import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const MainCoursesLayout = () => {
  return (
    <Stack screenOptions={{
      headerShown: false }}>
      
        <Stack.Screen name="(tabscourses)"/>
        <Stack.Screen name="(addcourses)"/>
    </Stack>
  );
}

export default MainCoursesLayout

const styles = StyleSheet.create({})