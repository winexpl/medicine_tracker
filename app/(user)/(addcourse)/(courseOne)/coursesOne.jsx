
//ЭКРАННАЯ ФОРМА ДОБАВЛЕНИЕ КУРСА ВАРИАНТ 1 (НЕДОДЕЛАННАЯ)

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

const MedicationCourseScreen = () => {
  const localParams = useLocalSearchParams();
  console.debug(localParams);
  const [course, setCourse] = useState(JSON.parse(localParams.course));
  const [medicament] = useState(JSON.parse(localParams.medicament));
  console.debug(course, medicament);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState(null); // 'start' или 'end'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [takeIndex, setTakeIndex] = useState(0);
  const [showPeriodicityModal, setShowPeriodicityModal] = useState(false);
  const [showDoseModal, setShowDoseModal] = useState(false);
  
  const [ defaultDate, setDefaultDate ] = useState(new Date('2024-12-05T00:00:00'));
  useEffect(() => {
    if(selectedDateType === 'start') setSelectedDate(new Date(course.startDate));
    else setSelectedDate(new Date(course.endDate));
  }, [selectedDateType]);
  // Добавление нового приема
  const addTake = () => {
    setCourse(prevState => ({ ...prevState, schedule: ["00:00:00", ...course.schedule]}));
  };

  // Обновление времени для конкретного приема
  const updateTakeTime = (newTime) => {
    const newSchedule = [...course.schedule];
    newSchedule[takeIndex] = newTime.toLocaleTimeString();
    newSchedule.sort();
    setCourse(prevState => ({ ...prevState, schedule: newSchedule}));
  };

  // Расчет общего количества приемов
  const calculateTotalTakes = () => {
    console.log(course.schedule.length );
    const days = Math.ceil(
        (new Date(course.endDate).getTime() - new Date(course.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1; // +1 чтобы включить начальную дату
    return (days / course.period * course.schedule.length);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Добавление курса</Text>
      
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            setSelectedDateType('start');
            setShowDatePicker(true);
          }}>
          <Text style={styles.dateText}>Начало: {new Date(course.startDate).toLocaleDateString()}</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            setSelectedDateType('end');
            setShowDatePicker(true);
          }}>
          <Text style={styles.dateText}>Окончание: {new Date(course.endDate).toLocaleDateString()}</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowPeriodicityModal(true)}>
          <Text style={styles.periodicityText}>Периодичность: {course.period} д.</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.totalAppointments}>Всего приемов: {calculateTotalTakes()}</Text>

      <View>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDoseModal(true)}>
          <Text style={styles.periodicityText}>Доза: {course.dose} д.</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={course.schedule}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          return(<View style={styles.appointmentRow}>
            <Text style={styles.appointmentText}>{index+1}</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => {
                setTakeIndex(index);
                setShowTimePicker(true);
            }}>

            <Text style={styles.timeText}>{item}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => {
                const newTakes = [...course.schedule];
                newTakes.splice(index, 1);
                setCourse(prevState => ({...prevState, schedule: newTakes}))
              }}>
                <Text>Удалить</Text>
              </TouchableOpacity>
          </View>)
        }}
        style={styles.list}
      />

      <TouchableOpacity style={styles.addButton} onPress={addTake}>
        <Text style={styles.addButtonText}>+ Добавить прием</Text>
      </TouchableOpacity>

      {showTimePicker && (
        <DateTimePicker
          mode="time"
          value={new Date()}
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) {
              updateTakeTime(selectedTime);
            }
          }}
        />
      )}

      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={selectedDate}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              if (selectedDateType === 'start') {
                setCourse(prevState => ({ ...prevState, startDate: selectedDate}));
              } else {
                setCourse(prevState => ({ ...prevState, endDate: selectedDate}));
              }
            }
          }}
        />
      )}

      <Modal visible={showPeriodicityModal} transparent>
        <View style={styles.modal}>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="Введите периодичность"
            onChangeText={(text) => setCourse(prevState => ({...prevState, period: Number(text)}))}
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setShowPeriodicityModal(false)}
          >
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={showDoseModal} transparent>
        <View style={styles.modal}>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="Введите размер дозы"
            onChangeText={(text) => setCourse(prevState => ({...prevState, dose: Number(text)}))}
          />
          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setShowDoseModal(false)}
          >
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Text>{`Доза: ${course.dose} `}</Text>
      <View style={styles.modes}>
        {['До еды', 'После еды', 'Во время еды', 'Независимо от приема пищи'].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.modeButton,
              { backgroundColor: course.regimen === item ? '#000' : '#FFF' },
            ]}
            onPress={() => setCourse(prevState => ({...prevState, regimen: item}))}>
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
    padding: 10,
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
