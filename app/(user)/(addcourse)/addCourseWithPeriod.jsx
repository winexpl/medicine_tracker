import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, FlatList } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import DatePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dosageFormTo } from '../../../components/Models';
import { addCourses, CourseContext, saveCourses } from '../../../contexts/CoursesContext';
import { TakeContext } from '../../../contexts/TakesContext';
import { saveTakes } from '../../../contexts/TakesContext';
import ErrorModal from '../../../components/ErrorModal'; // Import the error modal

const AddCourseWithPeriod = () => {
  const { courses, setCourses } = useContext(CourseContext);
  const { takes, setTakes } = useContext(TakeContext);
  const localParams = useLocalSearchParams();
  const [course, setCourse] = useState({
    ...JSON.parse(localParams.course), 
    regimen: 'Независимо от приема пищи',
  });
  const [medicament] = useState(JSON.parse(localParams.medicament));
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDateType, setSelectedDateType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectIndexInSchedule, setSelectIndexInSchedule] = useState(0);
  const [showPeriodicityModal, setShowPeriodicityModal] = useState(false);
  const [showDoseModal, setShowDoseModal] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [period, setPeriod] = useState(1);

  // State for error modal
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Function to show error messages in the modal
  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  // Function to close the error modal
  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  async function setAll() {
    let newCourses = [course];
    if (courses.length > 0) {
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
  }, [endDate, startDate, schedule, period]);

  // Расчет общего количества приемов
  const calculateTotalTakes = () => {
    const days = Math.ceil(
        (new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const result = (days / period) * schedule.length;
    return Math.ceil(result);
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-primary-back">
      <ScrollView>
        <Text className="text-lg font-bold text-center mb-4 text-white">Добавление курса</Text>
        <ErrorModal
          isVisible={showErrorModal}
          message={errorMessage}
          onClose={closeErrorModal}
        />
    
        <View className="flex-row justify-between mb-4">
          <TouchableOpacity
            className="p-3 bg-gray-200 rounded-lg"
            onPress={() => {
              setSelectedDateType('start');
              setSelectedDate(new Date(course.startDate));
              setShowDatePicker(true);
            }}>
            <Text className="text-base text-gray-800">Начало: {new Date(course.startDate).toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity
            className="p-3 bg-gray-200 rounded-lg mb-4"
            onPress={() => {
              setSelectedDateType('end');
              setSelectedDate(new Date(course.endDate));
              setShowDatePicker(true);
            }}>
            <Text className="text-base text-gray-800">Окончание: {new Date(course.endDate).toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity
            className="p-3 bg-gray-200 rounded-lg mb-4"
            onPress={() => setShowPeriodicityModal(true)}>
            
            <Text className="text-base text-center">Периодичность: {course.period} д.</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-base mb-4 text-white">Всего приемов: {course.numberMedicine}</Text>

        <View>
          <TouchableOpacity
            className="p-3 bg-gray-200 rounded-lg mb-4"
            onPress={() => setShowDoseModal(true)}>
            <Text className="text-base text-center">Доза: {course.dose} {dosageFormTo(medicament.dosageForm)}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={course.schedule}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return(
            <View className="flex-row justify-between p-3 bg-gray-200 rounded-lg mb-2 items-center">
              <Text className="text-base">{index+1}</Text>

              <TouchableOpacity
                className="p-2 bg-gray-200 rounded-lg"
                onPress={() => {
                  setSelectIndexInSchedule(index);
                  setShowTimePicker(true);
              }}>

              <Text className="text-base">{item}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="p-2 bg-gray-200 rounded-lg"
                onPress={() => {
                  const newSchedule = [...schedule];
                  newSchedule.splice(index, 1);
                  setSchedule(newSchedule);
                }}>
                  <Text className="text-red-500">Удалить</Text>
                </TouchableOpacity>
            </View>)
          }}
          className="flex-grow-0"
        />

        <TouchableOpacity className="p-4 bg-primary-text rounded-lg text-center mb-4" onPress={addTake}>
          <Text className="text-center text-black">+ Добавить прием</Text>
        </TouchableOpacity>

        {showTimePicker && (
        <DatePicker
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
        <DatePicker
          mode="date"
          value={selectedDate}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              if (selectedDateType === 'start') {
                if(selectedDate > endDate) {
                  showError('Дата начала не может быть позже даты окончания');
                  return;
                }
                setStartDate(selectedDate);
              } else {
                if(selectedDate < startDate) {
                  showError('Дата окончания не может быть раньше даты начала');
                  return;
                }
                setEndDate(selectedDate);
              }
            }
          }}
        />
      )}

        <Modal visible={showPeriodicityModal} transparent>
          <View className="flex-1 justify-center items-center bg-black/50">
            <TextInput
              className="w-48 p-3 bg-white rounded-lg mb-4"
              keyboardType="number-pad"
              placeholder="Введите периодичность"
              onChangeText={(text) => {
                let n = (Number(text));
                setPeriod(n);
              }
              }
            />
            <TouchableOpacity
              className="p-3 bg-primary-text rounded-lg"
              onPress={() =>  {
                setShowPeriodicityModal(false)
                if(period <= 0){
                  showError('Периодчиность должна быть положительной');
                  setPeriod(1);
                }}}
            >
              <Text className="text-base text-black">OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal visible={showDoseModal} transparent>
          <View className="flex-1 justify-center items-center bg-black/50">
            <TextInput
              className="w-48 p-3 bg-white rounded-lg mb-4"
              keyboardType="number-pad"
              placeholder="Введите размер дозы"
              onChangeText={(text) => setCourse(prevState => ({...prevState, dose: Number(text)}))}
            />
            <TouchableOpacity
              className="p-3 bg-primary-text rounded-lg"
              onPress={() => {setShowDoseModal(false)
                if (course.dose <= 0) {
                  showError('Доза должна быть положительной');
                  setCourse(prevState => ({ ...prevState, dose: 0 }));
                }
              }
              }
              
            >
            
              <Text className="text-base text-black">OK</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        
          {['До еды', 'После еды', 'Во время еды', 'Независимо от приема пищи'].map((item) => (
            <TouchableOpacity
              key={item}
              className={`p-3 bg-gray-200 rounded-lg mb-4  ${
                course.regimen === item ? 'bg-gray-200' : 'bg-primary-text'
              }`}
              onPress={() => setCourse(prevState => ({...prevState, regimen: item}))}>
              <Text className="text-bg-black">{item}</Text>
            </TouchableOpacity>
          ))}
      

        <TouchableOpacity
            className="p-3 bg-primary-text rounded-lg mt-4"
            onPress={async () => {
              // вся логика в addCourses
              setAll();
            }}>
            
            <Text className="text-black text-center">OK</Text>
          </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddCourseWithPeriod;
