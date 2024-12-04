
//ЭКРАННАЯ ФОРМА С ВЫБОРОМ ОДНОГО ИЗ 3 ВАРИАНТОВ ПРИЕМА КУРСА (ВЫБОР КУРСА)

import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router} from 'expo-router'
import { useState } from 'react';

const HomeScreen = ({ navigation }) => {
  const [ course, setCourse ] = useState({id:null,accountId:null,medicamentId:null,
        dose:null,startDate:null,endDate:null,typeCourse:null,weekday:null,period:null,regimen:null,numberMedicine:null,schedule:null,state:null})
  return (
    <SafeAreaView className="flex-1 bg-primary-back p-4">

<<<<<<< HEAD
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
=======
      <TouchableOpacity style={styles.button} onPress={() => {
        setCourse(prevState => ({
          ...prevState, typeCourse:2
        }))
        router.push({
          pathname: 'changeMedicament',
          params: course  // передаем объект курса в параметры
          });
      }}>
        <Text style={styles.text}>Составить расписание на 1 день и выбрать периодичность</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => {
        setCourse(prevState => ({
          ...prevState, typeCourse:1
        }))
        router.push({
          pathname: 'changeMedicament',
          params: course  // передаем объект курса в параметры
          });}}>
        <Text style={styles.text}>Составить расписание на неделю</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => {
        setCourse(prevState => ({
          ...prevState, typeCourse:3
        }))
        router.push({
          pathname: 'changeMedicament',
          params: course  // передаем объект курса в параметры
          });}}>
        <Text style={styles.text}>Принимать лекарственные средства по необходимости</Text>
>>>>>>> 75220c7044a89603250ee2026c9dbba0090f454c
      </TouchableOpacity>
      
    </SafeAreaView>
  );
};

export default HomeScreen;
