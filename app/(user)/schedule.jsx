import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, TouchableOpacity, Button, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const Schedule = () => {
  const [selectedDay, setSelectedDay] = useState('Пн'); // Выбранный день недели
  const [currentDate, setCurrentDate] = useState(new Date()); // Текущая дата для недели
  const [showCalendar, setShowCalendar] = useState(false); // Состояние для показа календаря

  // Состояние для хранения списка приёмов
  const [medicationLog, setMedicationLog] = useState({
    Пн: [
      { name: 'Аспирин', time: '8:00', taken: null },
      { name: 'Ибупрофен', time: '9:00', taken: null },
      { name: 'Парацетамол', time: '10:00', taken: null },
      { name: 'Аспирин', time: '8:00', taken: null },
      { name: 'Ибупрофен', time: '9:00', taken: null },
      { name: 'Парацетамол', time: '10:00', taken: null },
      { name: 'Аспирин', time: '8:00', taken: null },
      { name: 'Ибупрофен', time: '9:00', taken: null },
      { name: 'Парацетамол', time: '10:00', taken: null },
      { name: 'Аспирин', time: '8:00', taken: null },
      { name: 'Ибупрофен', time: '9:00', taken: null },
      { name: 'Парацетамол', time: '10:00', taken: null },
    ],
    Вт: [{ name: 'Аспирин', time: '8:00', taken: null }],
    Ср: [{ name: 'Аспирин', time: '8:00', taken: null }],
    Чт: [{ name: 'Аспирин', time: '8:00', taken: null }],
    Пт: [{ name: 'Аспирин', time: '8:00', taken: null }],
    Сб: [{ name: 'Аспирин', time: '8:00', taken: null }],
    Вс: [{ name: 'Аспирин', time: '8:00', taken: null }],
  });

  // Получение дат недели на основе текущей даты
  const getWeekDates = (date) => {
    const weekDates = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1)); // Начало недели

    for (let i = 0; i < 7; i++) {
      const newDate = new Date(startOfWeek);
      newDate.setDate(startOfWeek.getDate() + i);
      weekDates.push(newDate);
    }
    return weekDates;
  };

  const weekDates = getWeekDates(currentDate);

  const handleWeekChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction * 7); // Перемещение на неделю вперед или назад
    setCurrentDate(newDate);
  };

  const handleDateChange = (date) => {
    if (date) {
      setCurrentDate(date);
    }
    setShowCalendar(false); // Скрытие календаря
  };

  const formatDate = (date) => {
    const day = date.getDate();
    return `${day}`;
  };

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  // Функция для удаления приёма
  const removeMedication = (index) => {
    setMedicationLog((prevLog) => {
      const updatedLog = { ...prevLog };
      updatedLog[selectedDay] = updatedLog[selectedDay].filter((_, i) => i !== index);
      return updatedLog;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.navigation}>
        <Button title="←" onPress={() => handleWeekChange(-1)} />
        <Button title="Выбрать неделю" onPress={() => setShowCalendar(true)} />
        <Button title="→" onPress={() => handleWeekChange(1)} />
      </SafeAreaView>

      {showCalendar && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display="default"
          onChange={(event, date) => handleDateChange(date)}
        />
      )}

      <SafeAreaView style={styles.daySelector}>
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === day && styles.selectedDayButton,
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={styles.dayText}>{`${day} ${formatDate(weekDates[index])}`}</Text>
          </TouchableOpacity>
        ))}
      </SafeAreaView>

      <Text style={styles.dateText}>{`Расписание на ${selectedDay}`}</Text>

      <ScrollView style={styles.scrollView}>
        {medicationLog[selectedDay].map((medication, index) => (
          <View key={index} style={styles.medicationItem}>
            <Text style={styles.medicationText}>
              {`${medication.time} ${medication.name}`}
            </Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={styles.checkButton}
                onPress={() => removeMedication(index)}
              >
                <Text style={styles.buttonText}>✔️</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.crossButton}
                onPress={() => removeMedication(index)}
              >
                <Text style={styles.buttonText}>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Button title="Добавить прием" onPress={() => { /* Add your handler here */ }} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#1C1C2B',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayButton: {
    padding: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#FF8F00',
  },
  selectedDayButton: {
    backgroundColor: '#FFF',
  },
  dayText: {
    color: '#000',
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
    marginVertical: 10,
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  medicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FFF',
    marginBottom: 5,
    borderRadius: 5,
  },
  medicationText: {
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
  },
  checkButton: {
    marginRight: 5,
  },
  crossButton: {
    marginLeft: 5,
  },
  buttonText: {
    fontSize: 16,
  },
});

export default Schedule;
