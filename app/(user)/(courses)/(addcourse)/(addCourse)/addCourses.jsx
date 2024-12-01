
//ЭКРАННАЯ ФОРМА С ВЫБОРОМ ОДНОГО ИЗ 3 ВАРИАНТОВ ПРИЕМА КУРСА (ВЫБОР КУРСА)

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link , router} from 'expo-router'

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => {
          console.log('push');
          router.push('../(courseSelection)/courseSelections');}}>
        <Text style={styles.text}>Составить расписание на 1 день и выбрать периодичность</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => {
          console.log('push');
          router.push('../(courseSelection)/courseSelections');}}>
        <Text style={styles.text}>Составить расписание на неделю</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => {
          console.log('push');
          router.push('../(courseSelection)/courseSelections');}}>
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
