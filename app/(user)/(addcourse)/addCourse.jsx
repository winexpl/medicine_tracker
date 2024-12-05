import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

const MedicationForm = ({ navigation }) => {
  const [medication, setMedication] = useState('Аспирин');
  const [dosage, setDosage] = useState(2);
  const [schedules, setSchedules] = useState([{ id: 1, time: '8:00' }]); // Список приёмов
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(null); // Текущий индекс для изменения времени

  // Функция для добавления нового приёма
  const addSchedule = () => {
    const newSchedule = { id: schedules.length + 1, time: '8:00' };
    setSchedules([...schedules, newSchedule]);
  };

  // Функция для изменения времени приёма
  const changeTime = (event, selectedTime) => {
    if (selectedTime) {
      const updatedSchedules = [...schedules];
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      updatedSchedules[currentScheduleIndex].time = `${hours}:${minutes.toString().padStart(2, '0')}`;
      setSchedules(updatedSchedules);
    }
    setShowTimePicker(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      <View className="mb-4">
      {/* Верхняя часть с текущим курсом */}
      <Text className="font-bold mb-2">Текущий курс</Text>

      {/* Поле для выбора лекарства */}
      <View className="flex-row items-center mb-4">
        <Text className="font-bold">Лекарство:</Text>
        <TouchableOpacity
          className="flex-1 border border-gray-300 rounded px-2 py-1 mx-2"
          onPress={() => navigation.navigate('MedicationSelection')} // Переход на другую форму
        >
          <Text className="">{medication}</Text>
        </TouchableOpacity>
      </View>

      {/* Поле для дозы */}
      <View className="flex-row items-center mb-4">
        <Text className="font-bold">Доза:</Text>
        <TouchableOpacity
          className="flex-1 border border-gray-300 rounded px-2 py-1 mx-2"
          onPress={() => {
            // Логика выбора дозы (можно реализовать через модальное окно)
            const newDosage = prompt('Введите дозу:', dosage); // prompt используется как пример
            if (newDosage) setDosage(newDosage);
          }}
        >
          <Text className="">{dosage}</Text>
        </TouchableOpacity>
        <Text className="">Таблетки</Text>
      </View>

      {/* Список приёмов */}
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View className="flex-row items-center mb-4">
            <Text className="">{`${item.id} прием`}</Text>
            <TouchableOpacity
              className="flex-1 border border-gray-300 rounded px-2 py-1 mx-2"
              onPress={() => {
                setCurrentScheduleIndex(index);
                setShowTimePicker(true);
              }}
            >
              <Text className="">{item.time}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Кнопка добавления приёма */}
      <TouchableOpacity className="bg-orange-500 rounded px-4 py-3 items-center my-4" onPress={addSchedule}>
        <Text className="text-white font-bold">+ Добавить прием</Text>
      </TouchableOpacity>

      {/* Кнопка завершения курса */}
      <TouchableOpacity className="bg-gray-300 rounded px-4 py-3 items-center">
        <Text className="text-black font-bold">Завершить курс</Text>
      </TouchableOpacity>

      {/* Всплывающее окно выбора времени */}
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={changeTime}
        />
      )}
    </View>
    </SafeAreaView>
  );
};

export default MedicationForm;
