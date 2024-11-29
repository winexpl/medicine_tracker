'use client';

import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const FormField = ({
    title,
    value,
    placeholder,
    handleChangeText,
    otherStyles,
    ...props
}) => {
    const [showPassword, setshowPassword] = useState(false)
    return (
      <View className={`space-y-2 ${otherStyles}`}>
        <Text className="text-base text-secondary-text font-pmedium">{title}</Text>
        <View className='rounded-xl w-full h-14 px-4 bg-primary-back justify-center items-center flex-row'>
          <TextInput 
              className="flex-1 text-secondary-text font-psemibolds"
              value={value}
              placeholder={placeholder}
              placeholderText='#ffd5aa'
              onChangeText={handleChangeText}
              secureTextEntry={title === 'Пароль' && !showPassword}
          />
          {title === 'Пароль' && (
              <TouchableOpacity onPress={() => setshowPassword(!showPassword)} 
              className='items-end'>
                  <Ionicons name={!showPassword ? "eye" : "eye-off"} size={25}/>
              </TouchableOpacity>
          )}
        </View>
      </View>
    )
}

export default FormField

const styles = StyleSheet.create({})