import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { CourseContext } from '../../../contexts/CoursesContext';
import { getTakesByDate } from '../../../components/Models';
import { Ionicons } from '@expo/vector-icons'; // Импортируем иконки
import { saveTakes, TakeContext } from '../../../contexts/TakesContext';
import { router } from 'expo-router';

export default function Schedule () {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Выбранная дата
  const [selectedDayIndex, setSelectedDayIndex] = useState(new Date().getDay() || 7); // Индекс выбранного дня недели
  const [showCalendar, setShowCalendar] = useState(false); // Состояние для показа календаря
  const { courses, setCourses } = useContext(CourseContext);

  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const { takes, setTakes } = useContext(TakeContext);
  
  const take = (id) => {  
    const updatedTakes = [...takes];  // Создаем копию массива
    const index = updatedTakes.findIndex(m => m.id === id);
    if (index !== -1) {
      updatedTakes[index] = { ...updatedTakes[index], state: true };  // Обновляем элемент
    }
    setTakes(updatedTakes);  // Обновляем состояние с новым массивом
    saveTakes(takes);
  }

  function donttake(id) {
    const updatedTakes = [...takes];  // Создаем копию массива
    const index = updatedTakes.findIndex(m => m.id === id);
    if (index !== -1) {
      updatedTakes[index] = { ...updatedTakes[index], state: false };  // Обновляем элемент
    }
    setTakes(updatedTakes);  // Обновляем состояние с новым массивом
    saveTakes(takes);
  }
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedDayIndex(new Date(date).getDay() || 7);
    setShowCalendar(false); // Скрыть календарь после выбора даты
  };

  const handleWeekChange = (direction) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + direction * 7); // Изменение недели
    const updatedDate = current.toISOString().split('T')[0];
    setSelectedDate(updatedDate);
  };

  const handleDaySelect = (dayIndex) => {
    const current = new Date(selectedDate);
    const currentDay = current.getDay() || 7; // Текущий день недели
    const diff = dayIndex - currentDay;
    current.setDate(current.getDate() + diff);
    setSelectedDate(current.toISOString().split('T')[0]);
    setSelectedDayIndex(dayIndex);
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Кнопки для переключения недель */}
      <SafeAreaView style={styles.weekNavigation}>
        <TouchableOpacity style={styles.weekButton} onPress={() => handleWeekChange(-1)}>
          <Text style={styles.weekButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.weekText}>Выбрать неделю</Text>
        <TouchableOpacity style={styles.weekButton} onPress={() => handleWeekChange(1)}>
          <Text style={styles.weekButtonText}>→</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Дни недели */}
      <SafeAreaView style={styles.daySelector}>
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayButton,
              selectedDayIndex === index + 1 && styles.selectedDayButton,
            ]}
            onPress={() => handleDaySelect(index + 1)}
          >
            <Text style={styles.dayButtonText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </SafeAreaView>

      {/* Кнопка для календаря */}
      <SafeAreaView style={styles.navigation}>
        <TouchableOpacity
          style={styles.orangeButton}
          onPress={() => setShowCalendar(!showCalendar)}
        >
          <Text style={styles.orangeButtonText}>
            {showCalendar ? 'Скрыть календарь' : 'Выбрать дату'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Календарь */}
      {showCalendar && (
        <Calendar
          onDayPress={(day) => handleDateChange(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: '#FF8F00' },
          }}
          theme={{
            backgroundColor: '#1C1C2B',
            calendarBackground: '#FF8F00',
            textSectionTitleColor: '#fff',
            selectedDayBackgroundColor: '#000',
            selectedDayTextColor: '#fff',
            todayTextColor: '#000',
            dayTextColor: '#000',
            arrowColor: '#fff',
            monthTextColor: '#FFF',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16,
          }}
        />
      )}

      {/* Список приёмов */}
      <Text style={styles.dateText}>{`Расписание на ${selectedDate}`}</Text>
      <ScrollView style={styles.scrollView}>
        {getTakesByDate(selectedDate).map((takem, index) => (
          <View key={index} style={takem.state ? styles.medicationItemTaked : styles.medicationItemUntaked}>
            <Text style={styles.medicationText}>
              {`${new Date(takem.datetime).toLocaleTimeString()} ${(takem.title)}`}
            </Text>

            <TouchableOpacity
              style={styles.crossButton}
              onPress={() => {take(takem.id);}}>
              
              <Ionicons name="thumbs-up" size={24} color="green" />
            </TouchableOpacity>

            <TouchableOpacity className="items-end"
              style={styles.crossButton}
              onPress={() => {donttake(takem.id);}}>
              <Ionicons name="thumbs-down" size={24} color="red" />
            </TouchableOpacity>


          </View>
        ))}
      </ScrollView>

      {/* Кнопка добавить */}
      <TouchableOpacity style={styles.orangeButton} onPress={() => { router.push('addTake') }}>
        <Text style={styles.orangeButtonText}>Добавить приём</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#1C1C2B',
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  weekButton: {
    backgroundColor: '#FF8F00',
    padding: 10,
    borderRadius: 5,
  },
  weekButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  weekText: {
    fontSize: 16,
    color: '#FFF',
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FF8F00',
  },
  selectedDayButton: {
    backgroundColor: '#FFF',
  },
  dayButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  orangeButton: {
    backgroundColor: '#FF8F00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orangeButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 16,
    marginVertical: 10,
    color: 'white',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  medicationItemTaked: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'lightgreen',
    marginBottom: 5,
    borderRadius: 5,
  },
  medicationItemUntaked: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'lightcoral',
    marginBottom: 5,
    borderRadius: 5,
  },
  medicationText: {
    fontSize: 16,
  },
  crossButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 16,
  },
});