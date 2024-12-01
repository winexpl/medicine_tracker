
//ЭКРАННАЯ ФОРМА ДОБАВЛЕНИЕ КУРСА ВАРИАНТ 1 (НЕДОДЕЛАННАЯ)

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const MedicationCourseScreen = () => {
  const [appointments, setAppointments] = useState([
    { id: 1, time: '8:00', dose: '1 табл', mode: 'До еды' },
  ]);
  const [startDate, setStartDate] = useState(new Date(2024, 4, 2)); // 2 мая 2024
  const [endDate, setEndDate] = useState(new Date(2024, 4, 15)); // 15 мая 2024
  const [periodicity, setPeriodicity] = useState(1); // В днях
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState(null); // 'start' или 'end'
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

  const [doseModalVisible, setDoseModalVisible] = useState(false);
  const [selectedDose, setSelectedDose] = useState('1 табл');

  const [showPeriodicityModal, setShowPeriodicityModal] = useState(false);
  const [selectedMode, setSelectedMode] = useState('До еды');

  // Добавление нового приема
  const addAppointment = () => {
    const newAppointment = {
      id: appointments.length + 1,
      time: '8:00',
      dose: selectedDose,
      mode: selectedMode,
    };
    setAppointments([...appointments, newAppointment]);
  };

  // Обновление времени для конкретного приема
  const updateAppointmentTime = (id, newTime) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === id ? { ...appointment, time: newTime } : appointment
      )
    );
  };

  // Расчет общего количества приемов
  const calculateTotalAppointments = () => {
    const days =
      Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1; // +1 чтобы включить начальную дату
    return Math.floor(days / periodicity);
  };

  // Рендеринг элемента приема
  const renderAppointmentItem = ({ item }) => (
    <View style={styles.appointmentRow}>
      <Text style={styles.appointmentText}>{item.id} прием</Text>

      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => {
          setSelectedAppointmentId(item.id);
          setShowTimePicker(true);
        }}
      >
        <Text style={styles.timeText}>{item.time}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Добавление курса</Text>

      {/* Периодичность и даты */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            setSelectedDateType('start');
            setShowDatePicker(true);
          }}
        >
          <Text style={styles.dateText}>
            Начало: {startDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      </View>
      <View>
      <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            setSelectedDateType('end');
            setShowDatePicker(true);
          }}
        >
          <Text style={styles.dateText}>
            Окончание: {endDate.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPeriodicityModal(true)}
      >
        <Text style={styles.periodicityText}>
          Периодичность: {periodicity} д.
        </Text>
      </TouchableOpacity>

      <Text style={styles.totalAppointments}>
        Всего приемов: {calculateTotalAppointments()}
      </Text>

      {/* Список приемов */}
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAppointmentItem}
        style={styles.list}
      />

      {/* Добавить прием */}
      <TouchableOpacity style={styles.addButton} onPress={addAppointment}>
        <Text style={styles.addButtonText}>+ Добавить прием</Text>
      </TouchableOpacity>

      {/* Выбор времени */}
      {showTimePicker && (
        <DateTimePicker
          mode="time"
          value={new Date()}
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              const hours = selectedTime.getHours();
              const minutes = selectedTime.getMinutes();
              const formattedTime = `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
              if (selectedAppointmentId !== null) {
                updateAppointmentTime(selectedAppointmentId, formattedTime);
              }
            }
          }}
        />
      )}

      {/* Выбор даты */}
      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={selectedDateType === 'start' ? startDate : endDate}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              if (selectedDateType === 'start') {
                setStartDate(selectedDate);
              } else {
                setEndDate(selectedDate);
              }
            }
          }}
        />
      )}

      {/* Модальное окно для выбора периодичности */}
      <Modal visible={showPeriodicityModal} transparent>
        <View style={styles.modal}>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="Введите периодичность"
            onChangeText={(text) => setPeriodicity(Number(text))}
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setShowPeriodicityModal(false)}
          >
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateButton: {
    padding: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
  },
  periodicityButton: {
    padding: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 16,
  },
  periodicityText: {
    fontSize: 16,
    textAlign: 'center',
  },
  totalAppointments: {
    fontSize: 16,
    marginBottom: 16,
  },
  list: {
    flexGrow: 0,
  },
  appointmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  appointmentText: {
    fontSize: 16,
  },
  timeButton: {
    padding: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  timeText: {
    fontSize: 16,
  },
  addButton: {
    padding: 16,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  input: {
    width: 200,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
  },
  modalButton: {
    padding: 12,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default MedicationCourseScreen;
