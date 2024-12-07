import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { CourseContext } from '../../../contexts/CoursesContext';
import { getTakesByDate } from '../../../components/Models';
import { Ionicons } from '@expo/vector-icons'; // Импортируем иконки
import { getTakes, saveTakes, TakeContext } from '../../../contexts/TakesContext';
import { router } from 'expo-router';
import { MedicamentContext } from '../../../contexts/MedicamentContext';

export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Выбранная дата
  const [selectedDayIndex, setSelectedDayIndex] = useState(new Date().getDay() || 7); // Индекс выбранного дня недели
  const [showCalendar, setShowCalendar] = useState(false); // Состояние для показа календаря
  const { courses, setCourses } = useContext(CourseContext);
  const { medicaments } = useContext(MedicamentContext);
  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const { takes, setTakes } = useContext(TakeContext);
    const [selectedBackgrounds, setSelectedBackgrounds] = useState({}); // Состояние для хранения фонов

  const updateBackground = (id, color) => {
    setSelectedBackgrounds((prev) => ({
      ...prev,
      [id]: color, // Обновляем цвет для определенного элемента
    }));
  };
  useEffect(() => {
    async function update() {
      const newTakes = await getTakes();
      setTakes(newTakes);
      console.log('ИЗМЕНЯЕМ ПРИЕМЫ ДЛЯ ОТОБРАЖЕНИЯ В РАСПИСАНИИ', newTakes);
    }
    update();
  }, [courses]);

  const take = (id) => {
    const updatedTakes = [...takes];  // Создаем копию массива
    const index = updatedTakes.findIndex(m => m.id === id);
    if (index !== -1) {
      updatedTakes[index] = { ...updatedTakes[index], state: true }; // Обновляем элемент
    }
    setTakes(updatedTakes); // Обновляем состояние с новым массивом
    saveTakes(takes);
  };

  const donttake = (id) => {
    const updatedTakes = [...takes]; // Создаем копию массива
    const index = updatedTakes.findIndex(m => m.id === id);
    if (index !== -1) {
      updatedTakes[index] = { ...updatedTakes[index], state: false }; // Обновляем элемент
    }
    setTakes(updatedTakes); // Обновляем состояние с новым массивом
    saveTakes(takes);
  };

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
    <SafeAreaView className="flex-1 p-2 bg-primary-back">
      {/* Кнопки для переключения недель */}
      <SafeAreaView className="flex-row justify-between items-center mb-2">
        <TouchableOpacity className="bg-primary-text p-3 rounded" onPress={() => handleWeekChange(-1)}>
          <Text className="text-black">←</Text>
        </TouchableOpacity>
        <Text className="text-white ">Выбрать неделю</Text>
        <TouchableOpacity className="bg-primary-text p-3 rounded" onPress={() => handleWeekChange(1)}>
          <Text className="text-black">→</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Дни недели */}
      <SafeAreaView className="flex-row justify-around mt-[-26px] mb-2">
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity
            key={index}
            className={`p-4 rounded bg-primary-text ${selectedDayIndex === index + 1 ? 'bg-white' : ''}`}
            onPress={() => handleDaySelect(index + 1)}
          >
            <Text className={` ${selectedDayIndex === index + 1 ? 'text-black' : 'text-black'}`}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </SafeAreaView>

      {/* Кнопка для календаря */}
      <SafeAreaView className="flex-row justify-center mb-2">
        <TouchableOpacity
          className="bg-primary-text px-5 mt-[-26px] py-3 rounded items-center justify-center"
          onPress={() => setShowCalendar(!showCalendar)}
        >
          <Text className="text-black">
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
      <Text className="text-white text-center my-2">{`Расписание на ${selectedDate}`}</Text>
      <ScrollView className="flex-1">
        {getTakesByDate(selectedDate, takes, courses, medicaments).map((takem, index) => (
          <View
            key={index}
            style={{
              backgroundColor: selectedBackgrounds[takem.id] || 'white', 
            }}
            className="flex-row items-center bg-white p-3 rounded mb-2"
          >
            <Text className="flex-1 text-black">
              {`${new Date(takem.datetime).toLocaleTimeString()} ${takem.title}`}
            </Text>

            <TouchableOpacity
              className="ml-3"
              onPress={() => {
                take(takem.id);
                updateBackground(takem.id, '#7cfc00'); // Меняем фон на зеленый
              }}
            >
              <Ionicons name="thumbs-up" size={24} color="green" />
            </TouchableOpacity>

            <TouchableOpacity
              className="ml-3"
              onPress={() => {
                donttake(takem.id);
                updateBackground(takem.id, '#ff4c5b'); // Меняем фон на красный
              }}
            >
              <Ionicons name="thumbs-down" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Кнопка добавить */}
      <TouchableOpacity className="bg-primary-text px-5 py-3 rounded items-center mt-3" onPress={() => { router.push('addTake'); }}>
        <Text className="text-black">Добавить приём</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
