
//ЭКРАННАЯ ФОРМА С ВЫБОРОМ ОДНОГО ИЗ 3 ВАРИАНТОВ ПРИЕМА КУРСА (ВЫБОР КУРСА)

import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router} from 'expo-router'
import { useState } from 'react';

const HomeScreen = ({ navigation }) => {
  const [ course, setCourse ] = useState({id:'',accountId:'',medicamentId:'',
        dose:0,startDate:new Date(),endDate:new Date(),typeCourse:0,weekday:0,period:1,regimen:'',
        numberMedicine:0,schedule:[],state:'Активный'})
  return (
    <SafeAreaView style={styles.container}>

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
      </TouchableOpacity>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C2B',
    padding: 16,
  },
  button: {
    backgroundColor: '#FF8F00',
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
});

export default HomeScreen;
