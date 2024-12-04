
//ЭКРАННАЯ ФОРМА С ВЫБОРОМ ОДНОГО ИЗ 3 ВАРИАНТОВ ПРИЕМА КУРСА (ВЫБОР КУРСА)

import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router} from 'expo-router'

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-primary-back p-4">

      <TouchableOpacity className="bg-primary-text p-4 my-2 border border-gray-300 rounded" onPress={() => {
        setTypeOfCourse(prevState => ({ ...prevState, type: 1 }));
        router.push('changeMedicament');}}>
        <Text className="text-base text-gray-800">Составить расписание на 1 день и выбрать периодичность</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-primary-text p-4 my-2 border border-gray-300 rounded" onPress={() => {
        setTypeOfCourse(prevState => ({ ...prevState, type: 2 }));
        router.push('changeMedicament');}}>
        <Text className="text-base text-gray-800">Составить расписание на неделю</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-primary-text p-4 my-2 border border-gray-300 rounded" onPress={() => {
        setTypeOfCourse(prevState => ({ ...prevState, type: 3 }));
        router.push('changeMedicament');}}>
        <Text className="text-base text-gray-800">Принимать лекарственные средства по необходимости</Text>
      </TouchableOpacity>
      
    </SafeAreaView>
  );
};

export default HomeScreen;
