import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { dosageFormTo } from '../../../components/Models';
import { addCourses, CourseContext, saveCourses } from '../../../contexts/CoursesContext';
import { TakeContext } from '../../../contexts/TakesContext';
import { saveTakes } from '../../../contexts/TakesContext';

const AddCourseWithPeriod = () => {
  const { courses, setCourses } = useContext(CourseContext);
  const { takes, setTakes } = useContext(TakeContext);
  const localParams = useLocalSearchParams();
  const [course, setCourse] = useState(JSON.parse(localParams.course));
  const [medicament] = useState(JSON.parse(localParams.medicament));
  console.debug(course, medicament);

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState(null); // 'start' или 'end'
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectIndexInSchedule, setSelectIndexInSchedule] = useState(0);
  const [showPeriodicityModal, setShowPeriodicityModal] = useState(false);
  const [showDoseModal, setShowDoseModal] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [period, setPeriod] = useState(1);

  async function setAll() {
    let newCourses = [course];
    if(courses.length > 0) {
      console.log(3)
      newCourses = [...courses, ...newCourses];
    }
    setCourses(newCourses);
    const newTakes = [...takes, ...await addCourses(course)];
    setTakes(newTakes);
    saveTakes(newTakes);
    router.push('coursesActive');
  }

  const addTake = () => {
    setSchedule(["00:00:00", ...schedule]);
  };

  useEffect(() => {
    setCourse(prevState => ({ ...prevState,
          startDate: startDate.toLocaleDateString("en-CA"),
          endDate: endDate.toLocaleDateString("en-CA"),
          schedule: schedule,
          period: period,
          numberMedicine: calculateTotalTakes()}));
  }, [endDate, startDate, schedule, period])

  // Расчет общего количества приемов
  const calculateTotalTakes = () => {
    console.log(course.schedule.length );
    const days = Math.ceil(
        (new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) + 1; // +1 чтобы включить начальную дату
    const result = (days / period) * schedule.length;
    return Math.ceil(result);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Добавление курса</Text>
      
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            setSelectedDateType('start');
            setSelectedDate(new Date(course.startDate));
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
            setSelectedDate(new Date(course.endDate));
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
      <Text style={styles.totalAppointments}>Всего приемов: {course.numberMedicine}</Text>

      <View>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDoseModal(true)}>
          <Text style={styles.periodicityText}>Доза: {course.dose} {dosageFormTo(medicament.dosageForm)}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={course.schedule}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          return(
          <View style={styles.appointmentRow}>
            <Text style={styles.appointmentText}>{index+1}</Text>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => {
                setSelectIndexInSchedule(index);
                setShowTimePicker(true);
            }}>

            <Text style={styles.timeText}>{item}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => {
                const newSchedule = [...schedule];
                newSchedule.splice(index, 1);
                setSchedule(newSchedule);
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
              const newSchedule = [...schedule];
              newSchedule[selectIndexInSchedule] = selectedTime.toLocaleTimeString();
              newSchedule.sort();
              setSchedule(newSchedule);
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
                setStartDate(selectedDate);
              } else {
                setEndDate(selectedDate);
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
            onChangeText={(text) => setPeriod(Number(text))}
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

      <TouchableOpacity
          style={styles.modalButton}
          onPress={ () => {
            // вся логика в addCourses
            setAll();
          }}>
          <Text style={styles.modalButtonText}>OK</Text>
        </TouchableOpacity>
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

export default AddCourseWithPeriod;
