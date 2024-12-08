import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, FlatList, ScrollView} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { dosageFormTo } from '../../../components/Models';
import { addCourses, CourseContext, saveCourses } from '../../../contexts/CoursesContext';
import { saveTakes, TakeContext } from '../../../contexts/TakesContext';
import { Checkbox } from 'react-native-paper';
import ErrorModal from '../../../components/ErrorModalTwo'; // Import the error modal

const AddCourseForAWeek = () => {
    const { courses, setCourses } = useContext(CourseContext);
    const { takes, setTakes } = useContext(TakeContext);
    const localParams = useLocalSearchParams();
    const [course, setCourse] = useState({
        ...JSON.parse(localParams.course), // сохраняем данные из localParams
        regimen: 'Независимо от приема пищи', // устанавливаем значение по умолчанию
    });
    const [medicament] = useState(JSON.parse(localParams.medicament));
    console.debug(course, medicament);

    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDateType, setSelectedDateType] = useState(null); // 'start' или 'end'
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectIndexInSchedule, setSelectIndexInSchedule] = useState(0);
    const [showDoseModal, setShowDoseModal] = useState(false);
    const [schedule, setSchedule] = useState([]);
    const [endDate, setEndDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date());
    const [weekday, setWeekday] = useState(0);
    const [checked, setChecked] = useState(false);

    const [selectedDays, setSelectedDays] = useState({
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
    });
  // Стейт для ошибки
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const showError = (message) => {
    setErrorMessage(message);
    setErrorModalVisible(true);
};

const hideError = () => {
    setErrorModalVisible(false);
};
    async function setAll() {
        let newCourses = [course];
        if(courses.length > 0) {
            newCourses = [...courses, ...newCourses];
        }
        if (course.dose < 0) {
            showError('Доза должна быть положительной!');
            return;
          }
        if(course.startDate > course.endDate){
            showError('Начало приема не должно превышать окончание приема!');
            return;
          }
      
          for(let i=0; course.schedule.length>i; i++){
            for(let j=0; course.schedule.length>j; j++){
              if(course.schedule[i]==course.schedule[j] && i!=j){
                showError('Время приема не должно совпадать!');
                return;
              }
            }
          }
        setCourses(newCourses);
        const newTakes = [...takes, ...await addCourses(course, takes)];
        setTakes(newTakes);
        saveTakes(newTakes);
        router.push('coursesActive');
    }

    const toggleDay = (day) => {
        setSelectedDays((prevState) => ({
            ...prevState,[day]: !prevState[day],  // Переключаем состояние дня
        }));
    };

    const addTake = () => {
        setSchedule(["00:00:00", ...schedule]);
    };

    useEffect(() => {
        setCourse(prevState => ({ ...prevState,
            startDate: startDate.toLocaleDateString("en-CA"),
            endDate: endDate.toLocaleDateString("en-CA"),
            schedule: schedule,
            weekday: weekday,
            numberMedicine: calculateTotalTakes()}));
    }, [endDate, startDate, schedule, weekday])

  // Расчет общего количества приемов
    const calculateTotalTakes = () => {
        console.log(course.schedule.length );
        let count = 0;
        let tempEndDate = new Date(endDate.getTime());
        tempEndDate.setDate(tempEndDate.getDate() + 1);
        let formattedWeekday = 0;
        if(weekday & 1) formattedWeekday = 1;
        for(let i = 1; i < 7; i++) {
            if(weekday & (1 << i)) {
                formattedWeekday |= 1 << (7 - i);
            }
        }
        
        for (let currentDate = new Date(); currentDate < tempEndDate; currentDate.setDate(currentDate.getDate() + 1)) {
            // Получаем день недели (0 - воскресенье, 1 - понедельник, ..., 6 - суббота)
            const dayOfWeek = currentDate.getDay();
            // Проверяем, есть ли этот день недели в маске
            console.log('dayOfWeek',dayOfWeek);
            if ((formattedWeekday & (1 << dayOfWeek)) !== 0) {
                count++;
            }
        }
        console.log('count', count);
        console.log('weekday', weekday);
        const result = count * schedule.length;
        return Math.ceil(result);
    };

    return (
        <SafeAreaView className="flex-1 p-4 bg-primary-back">
            <ScrollView>
                    <Text className="text-lg font-bold text-center mb-4 text-white">Добавление курса</Text>
                    
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

                    <View  className="mt-4">
                    <Text className="text-white">Выберите дни недели:</Text>
                            <View>
                            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday','sunday'].map((day, index) => (
                                <View key={day} className="flex-row items-center mb-2">
                                <Checkbox
                                    status={(weekday & (1 << 6-index)) > 0 ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        let i = 6-index;
                                        let newWeekday = weekday;
                                        let bit = (newWeekday & (1 << i)) >> i;
                                        if(bit === 0) {
                                            newWeekday |= (1 << i);
                                        }
                                        else {
                                            newWeekday &= ~(1 << i);
                                        }
                                        setWeekday(newWeekday);
                                    }}
                                />
                                <Text className="text-white">{day.charAt(0).toUpperCase() + day.slice(1)}</Text> {/* Отображаем день недели */}
                                </View>
                            ))}
                            </View>
                    </View>
                    <Text className="text-white">Всего приемов: {course.numberMedicine}</Text>

                    <View>
                        <TouchableOpacity
                        className="p-3 bg-gray-200 rounded-lg mb-4"
                        onPress={() => setShowDoseModal(true)}>
                        <Text className="text-center">Доза: {course.dose} {dosageFormTo(medicament.dosageForm)}</Text>
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={course.schedule}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item, index}) => {
                        return(
                        <View className="flex-row justify-between p-2 bg-white rounded-lg mb-2 items-center">
                            <Text className="">{index+1}</Text>
                            <TouchableOpacity
                            className="p-2 bg-gray-200 rounded-lg"
                            onPress={() => {
                                setSelectIndexInSchedule(index);
                                setShowTimePicker(true);
                            }}>

                            <Text className="">{item}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                            className="p-2 bg-gray-300 rounded-lg"
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
                        <Text className="text-black text-center">+ Добавить прием</Text>
                    </TouchableOpacity>
                    <ErrorModal
                        visible={errorModalVisible}
                        message={errorMessage}
                        onClose={hideError}
                    />
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

                    <Modal visible={showDoseModal} transparent>
                        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                        <TextInput
                            className="w-48 p-3 bg-white rounded-lg mb-4"
                            keyboardType="number-pad"
                            placeholder="Введите размер дозы"
                            onChangeText={(text) => setCourse(prevState => ({...prevState, dose: Number(text)}))}
                        />
                        <TouchableOpacity
                            className="p-3 bg-blue-500 rounded-lg"
                            onPress={() => setShowDoseModal(false)}
                        >
                            <Text className="text-white text-lg">OK</Text>
                        </TouchableOpacity>
                        </View>
                    </Modal>
                    {['До еды', 'После еды', 'Во время еды', 'Независимо от приема пищи'].map((item) => (
                    <TouchableOpacity
                        key={item}
                        className={`p-3 bg-gray-200 rounded-lg mb-4  ${
                        course.regimen === item ? 'bg-white' : 'bg-primary-text'
                        }`}
                        onPress={() => setCourse(prevState => ({...prevState, regimen: item}))}>
                        <Text className="text-bg-black">{item}</Text>
                    </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                        className="p-4 bg-primary-text rounded-lg text-center mb-4"
                        onPress={ () => {
                            setAll();
                        }}>
                        <Text className="text-black text-center">OK</Text>
                    </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
        
    );
};

export default AddCourseForAWeek;
