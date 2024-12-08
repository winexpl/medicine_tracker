import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'

const RouterButton = ({
    title,
    handlePress,
    containerStyle,
    textStyle,
    isLoading
}) => {
  return (
    <TouchableOpacity
        activeOpacity={0.4}
        onPress={handlePress}
        className={`bg-primary-text rounded-lg mb-4 min-h-[60px]
        min-w-[285px] items-center justify-center ${containerStyle}`}>
        <Text className={`text-3xl text-primary-back ${textStyle}`}>{title}</Text>
        {isLoading && (
        <ActivityIndicator
            animating={isLoading}
            color="#fff"
            size="small"
            className="ml-2"
        />
    )}
    </TouchableOpacity>
    
  )
}

export default RouterButton

const styles = StyleSheet.create({})