import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const AboutScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>О разработчиках</Text>
      <Text style={styles.text}>
        Это приложение было создано командой опытных разработчиков для упрощения управления курсами
        приема медикаментов. Наша цель — улучшить вашу жизнь с помощью технологий.
      </Text>
      <Text style={styles.text}>
        Команда:
        {'\n'}- Иван Иванов (Frontend)
        {'\n'}- Мария Петрова (Backend)
        {'\n'}- Алексей Сидоров (UI/UX Дизайн)
      </Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>Назад</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282C34',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 20,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#FF8F00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
