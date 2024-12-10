import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CourseContext } from '../../contexts/CoursesContext';
import { MedicamentContext } from '../../contexts/MedicamentContext';
import { TakeContext, saveTakes } from '../../contexts/TakesContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker'; // Импортируем Picker
import uuid from 'react-native-uuid';
import { router } from 'expo-router';

export default AddTake = () => {
    const { courses, setCourses } = useContext(CourseContext);
    const { medicaments, setMedicaments } = useContext(MedicamentContext);
    const { takes, setTakes } = useContext(TakeContext);

    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [selectedCourse, setSelectedCourse] = useState(null);

    const [take, setTake ] = useState({id:uuid.v4(), courseId:null, datetime: new Date(), state:true});

    // Фильтруем курсы, чтобы отображать только тип 3
    const course3 = courses.filter(c => Number(c.typeCourse) === 3);
    
    // Обновляем лейблы курсов на основе медикаментов
    course3.forEach(c => {
        let index = medicaments.findIndex(m => m.id === c.medicamentId);
        if (index !== -1) {
            c.label = medicaments[index].title;
            c.value = c.id;
        }
    });

    const handleValueChange = (courseId) => {
        let newTake = take;
        newTake.courseId = courseId;
        setSelectedCourse(courseId);
        setTake(newTake);
        console.log('НОВЫЙ ПРИЕМ', newTake);
    };

    // Обновляем дату и время
    const handleDateChange = (date) => {
        let newTake = { ...take, datetime: date };
        setTake(newTake);
        setSelectedDate(date);
        setShowDatePicker(false);
        console.log('НОВЫЙ ПРИЕМ - ДАТА', newTake, date.toLocaleDateString());
    };

    const handleTimeChange = (date) => {
        let newTake = { ...take };
        newTake.datetime.setHours(date.getHours());
        newTake.datetime.setMinutes(date.getMinutes());
        newTake.datetime.setSeconds(date.getSeconds());
        setTake(newTake);
        setSelectedTime(date);
        setShowTimePicker(false);
        console.log('НОВЫЙ ПРИЕМ - ВРЕМЯ', newTake, date.toLocaleTimeString());
    };

    return (
        <View className="flex-1 p-4 bg-primary-back">
            <View>
                <Text style={styles.label}>Выберите курс:</Text>
                <View className="bg-white mb-3">
                    {/* Заменили RNPickerSelect на Picker */}
                    <Picker
                        selectedValue={selectedCourse}
                        onValueChange={handleValueChange}
                    >
                        <Picker.Item label="Выберите курс" value={null} />
                        {course3.map((course) => (
                            <Picker.Item key={course.id} label={course.label} value={course.id} />
                        ))}
                    </Picker>
                </View>

                <View>
                    {selectedCourse && (
                    <View>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    setShowDatePicker(true);
                                }}
                            >
                                <Text style={styles.text}>Выберите дату приема {selectedDate.toLocaleDateString()}</Text>
                            </TouchableOpacity>

                            {showDatePicker && (
                                <DatePicker
                                    modal
                                    open={showDatePicker}
                                    date={selectedDate}
                                    onConfirm={handleDateChange}
                                    onCancel={() => setShowDatePicker(false)}
                                />
                            )}

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    setShowTimePicker(true);
                                }}
                            >
                                <Text style={styles.text}>Выберите время приема {selectedTime.toLocaleTimeString()}</Text>
                            </TouchableOpacity>

                            {showTimePicker && (
                                <DatePicker
                                    modal
                                    open={showTimePicker}
                                    date={selectedTime}
                                    mode="time"
                                    onConfirm={handleTimeChange}
                                    onCancel={() => setShowTimePicker(false)}
                                />
                            )}

                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    let newTake = { ...take };
                                    setTakes([...takes, newTake]);
                                    saveTakes([...takes, newTake]);
                                    router.back();
                                }}
                            >
                                <Text style={styles.text}>Сохранить прием</Text>
                            </TouchableOpacity>
                    </View>
                    )}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        marginBottom: 10,
        color: '#FFF',
        fontSize: 18,
    },
    button: {
        padding: 10,
        backgroundColor: '#FF8F00',
        borderRadius: 5,
        marginBottom: 10,
    },
    text: {
        color: '#000',
        fontSize: 16,
    },
});