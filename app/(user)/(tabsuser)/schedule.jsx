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
import * as Notifications from 'expo-notifications';

// First, set the handler that will cause the notification
// to show the alert
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// // Second, call scheduleNotificationAsync()
// Notifications.scheduleNotificationAsync({
//   content: {
//     title: 'Look at that notification',
//     body: "I'm so proud of myself!q2eqweqwe",
//   },
//   trigger: null,
// });

export default function Schedule() {

  const [notificationId, setNotificationId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA')); // Выбранная дата
  const [currentDay] = useState(new Date());
  const [selectedDayIndex, setSelectedDayIndex] = useState(new Date().getDay() || 7); // Индекс выбранного дня недели
  const [showCalendar, setShowCalendar] = useState(false); // Состояние для показа календаря
  const { courses, setCourses } = useContext(CourseContext); 
  const { medicaments } = useContext(MedicamentContext);
  const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const { takes, setTakes } = useContext(TakeContext);
  const [takesToday, setTakesToday] = useState([] );
  const [scheduledNotifications, setScheduledNotifications] = useState(new Set()); // Для отслеживания уведомлений


  useEffect(() => {
    async function name(params) {
      const newTakes = takes;
      for(let i in newTakes) {
        if(newTakes[i].state === true) {
          try {
            await Notifications.cancelScheduledNotificationAsync(newTakes[i].id);
            console.log('Notification canceled:', newTakes[i].id);
            // Удалите ID из состояния, чтобы больше не пытаться отменить это уведомление
            setScheduledNotifications(prev => {
              const updatedSet = new Set(prev);
              updatedSet.delete(newTakes[i].id); // Удаляем ID уведомления
              console.log('updatedSet',updatedSet);
              return updatedSet;
            });
          } catch (error) {
            console.error('Error canceling notification:', error);
          }
        }
      }
    }
    name();
    
    
  }, [takes]);

  useEffect(() => {
    async function update() {
      const newTakes = await getTakes();
      setTakes(newTakes);
      console.log('ИЗМЕНЯЕМ ПРИЕМЫ ДЛЯ ОТОБРАЖЕНИЯ В РАСПИСАНИИ', newTakes);
      console.log('УВЕДОМЛЕНИЯ',scheduledNotifications)
      
    }
    update();
    
  }, [courses]);

   // Функция планирования уведомлений
  const scheduleNotification = async (take) => {
    if (!take) return;

    const triggerTime = new Date(take.datetime);
    
    // Проверяем, запланировано ли уже уведомление
    if (scheduledNotifications.has(take.id)) {
      console.log('Notification already scheduled for this take:', take.id);
      return; // Если уведомление уже запланировано, не планируем повторно
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: take.title,
        body: "Примите лекарство!",
      },
      trigger: triggerTime,
    });

    setScheduledNotifications(prev => new Set(prev.add(take.id))); // Добавляем в Set запланированное уведомление
    setNotificationId(notificationId);
    console.log('Scheduled notification for:', triggerTime.toLocaleString());
  };

  useEffect(() => {
    let todayTakes = getTakesByDate(currentDay, takes, courses, medicaments);
    setTakesToday(todayTakes);

    if (todayTakes.length > 0) {
      todayTakes.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
      todayTakes = todayTakes.filter(t => t.state === false);
      console.log('ОТФИЛЬТРОВАННЫЕ ПРИЕМЫ', todayTakes);
      todayTakes.forEach(take => {
        if (!scheduledNotifications.has(take.id)) {
          scheduleNotification(take);
        }
      });
    }

    // Обработчик уведомлений
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        console.log('Notification received:', notification);

        // Обновляем список приемов
        const updatedTakes = [...takes];
        const nextTake = updatedTakes.find(t => new Date(t.datetime) > new Date() && !t.state);

        if (nextTake) {
          // Планируем следующее уведомление
          scheduleNotification(nextTake);
        }

        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        };
      },
    });
  }, [currentDay, takes]);
  

  

  const take = (id) => {
    const updatedTakes = [...takes];  // Создаем копию массива
    const index = updatedTakes.findIndex(m => m.id === id);
    if (index !== -1) {
      updatedTakes[index] = { ...updatedTakes[index], state: true }; // Обновляем элемент
    }
    console.log('ОБНОВЛЕННЫЙ ПРИЕМ', updatedTakes[index]);
    setTakes(updatedTakes); // Обновляем состояние с новым массивом
    saveTakes(updatedTakes);
  };

  const donttake = (id) => {
    const updatedTakes = [...takes]; // Создаем копию массива
    const index = updatedTakes.findIndex(m => m.id === id);
    if (index !== -1) {
      updatedTakes[index] = { ...updatedTakes[index], state: false }; // Обновляем элемент
    }
    setTakes(updatedTakes); // Обновляем состояние с новым массивом
    saveTakes(updatedTakes);
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
    <SafeAreaView className="min-h-full flex-1 p-2 bg-primary-back">
      {/* Кнопки для переключения недель */}
      <View className="flex-row justify-between items-center mb-10">
        <TouchableOpacity className="bg-primary-text p-3 rounded" onPress={() => handleWeekChange(-1)}>
          <Text className="text-black">←</Text>
        </TouchableOpacity>
        <Text className="text-white ">Выбрать неделю</Text>
        <TouchableOpacity className="bg-primary-text p-3 rounded" onPress={() => handleWeekChange(1)}>
          <Text className="text-black">→</Text>
        </TouchableOpacity>
      </View>

      {/* Дни недели */}
      <View className="flex-row justify-around mt-[-26px] mb-10">
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
      </View>

      {/* Кнопка для календаря */}
      <View className="flex-row justify-center mb-5">
        <TouchableOpacity
          className="bg-primary-text px-5 mt-[-26px] py-3 rounded items-center justify-center"
          onPress={() => setShowCalendar(!showCalendar)}
        >
          <Text className="text-black">
            {showCalendar ? 'Скрыть календарь' : 'Выбрать дату'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Календарь */}
      {showCalendar && (
        <Calendar
          onDayPress={(day) => handleDateChange(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: '#42aaff' },
          }}
          theme={{
            backgroundColor: '#1C1C2B',
            calendarBackground: '#42aaff',
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
              backgroundColor: takem.state ? '#013a33' : '#800000',
            }}
            className="flex-row items-center bg-white p-3 rounded mb-2"
          >
            <Text className="flex-1 text-white">
              {`${new Date(takem.datetime).toLocaleTimeString()} ${takem.title}`}
            </Text>

            <TouchableOpacity
              className="ml-3"
              onPress={() => {
                take(takem.id);
              }}
            >
              <Ionicons name="thumbs-up" size={24} color="green" />
            </TouchableOpacity>

            <TouchableOpacity
              className="ml-3"
              onPress={() => {
                donttake(takem.id);
              }}
            >
              <Ionicons name="thumbs-down" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Кнопка добавить */}
      <TouchableOpacity className="bg-primary-text px-5 py-3 rounded items-center mt-10" onPress={() => { router.push('addTake'); }}>
        <Text className="text-black">Добавить приём</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
