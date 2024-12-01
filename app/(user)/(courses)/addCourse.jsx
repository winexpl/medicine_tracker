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
    <View style={styles.container}>
      {/* Верхняя часть с текущим курсом */}
      <Text style={styles.label}>Текущий курс</Text>

      {/* Поле для выбора лекарства */}
      <View style={styles.row}>
        <Text style={styles.label}>Лекарство:</Text>
        <TouchableOpacity
          style={styles.selectField}
          onPress={() => navigation.navigate('MedicationSelection')} // Переход на другую форму
        >
          <Text style={styles.text}>{medication}</Text>
        </TouchableOpacity>
      </View>

      {/* Поле для дозы */}
      <View style={styles.row}>
        <Text style={styles.label}>Доза:</Text>
        <TouchableOpacity
          style={styles.selectField}
          onPress={() => {
            // Логика выбора дозы (можно реализовать через модальное окно)
            const newDosage = prompt('Введите дозу:', dosage); // prompt используется как пример
            if (newDosage) setDosage(newDosage);
          }}
        >
          <Text style={styles.text}>{dosage}</Text>
        </TouchableOpacity>
        <Text style={styles.text}>Таблетки</Text>
      </View>

      {/* Список приёмов */}
      <FlatList
        data={schedules}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.row}>
            <Text style={styles.text}>{`${item.id} прием`}</Text>
            <TouchableOpacity
              style={styles.selectField}
              onPress={() => {
                setCurrentScheduleIndex(index);
                setShowTimePicker(true);
              }}
            >
              <Text style={styles.text}>{item.time}</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Кнопка добавления приёма */}
      <TouchableOpacity style={styles.addButton} onPress={addSchedule}>
        <Text style={styles.addButtonText}>+ Добавить прием</Text>
      </TouchableOpacity>

      {/* Кнопка завершения курса */}
      <TouchableOpacity style={styles.finishButton}>
        <Text style={styles.finishButtonText}>Завершить курс</Text>
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
  );
};

export default MedicationForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectField: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  text: {
    fontSize: 16,
  },
  addButton: {
    padding: 12,
    backgroundColor: '#FF8F00',
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 16,
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFF',
  },
  finishButton: {
    padding: 12,
    backgroundColor: '#CCC',
    borderRadius: 4,
    alignItems: 'center',
  },
  finishButtonText: {
    fontSize: 16,
    color: '#000',
  },
});
