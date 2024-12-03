
//ЭКРАННАЯ ФОРМА С ВЫБОРОМ ОДНОГО ИЗ 3 ВАРИАНТОВ ПРИЕМА КУРСА (ВЫБОР КУРСА)

import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router} from 'expo-router'

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>

      <TouchableOpacity style={styles.button} onPress={() => {
        setTypeOfCourse(prevState => ({ ...prevState, type: 1 }));
        router.push('changeMedicament');}}>
        <Text style={styles.text}>Составить расписание на 1 день и выбрать периодичность</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => {
        setTypeOfCourse(prevState => ({ ...prevState, type: 2 }));
        router.push('changeMedicament');}}>
        <Text style={styles.text}>Составить расписание на неделю</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => {
        setTypeOfCourse(prevState => ({ ...prevState, type: 3 }));
        router.push('changeMedicament');}}>
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
