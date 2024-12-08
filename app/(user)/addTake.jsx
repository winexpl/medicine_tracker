import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { CourseContext } from '../../contexts/CoursesContext';
import { MedicamentContext } from '../../contexts/MedicamentContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { saveTakes, TakeContext } from '../../contexts/TakesContext';
import uuid from 'react-native-uuid';
import { router } from 'expo-router';

const AddTake = () => {
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
    const course3 = courses.filter(c => c.typeCourse === '3');
    
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
    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        console.log('СТАРЫЙ ПРИЕМ', newTake);
        let newTake = take;
        try {
            newTake.datetime.setDate(selectedDate.getDate());
            newTake.datetime.setMonth(selectedDate.getMonth());
            newTake.datetime.setFullYear(selectedDate.getFullYear());
        } catch (error) {
            console.error('АШИБКА УСТАНОВКИ ДАТЫ', error);
        }
        console.log('НОВЫЙ ПРИЕМ', newTake, new Date(newTake.datetime).toLocaleDateString());
        setTake(newTake);
        setSelectedDate(selectedDate);
    };

    const handleTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        let newTake = take;
        console.log('СТАРЫЙ ПРИЕМ', newTake);
        try {
            setSelectedTime(selectedTime);
            newTake.datetime.setHours(selectedTime.getHours());
            newTake.datetime.setMinutes(selectedTime.getMinutes());
            newTake.datetime.setSeconds(selectedTime.getSeconds());
        } catch (error) {
            console.error('АШИБКА УСТАНОВКИ ВРЕМЕНИ', error);
        }
        console.log('НОВЫЙ ПРИЕМ', newTake, new Date(newTake.datetime).toLocaleTimeString());
        setTake(newTake);
    };

    return (
        <SafeAreaView className="flex-1 p-4 bg-primary-back">
            <View>
                <Text style={styles.label}>Выберите курс:</Text>
                <View className="bg-primary-text">
                    <RNPickerSelect
                        onValueChange={handleValueChange}
                        items={course3}
                        placeholder={{
                            label: 'Выберите курс',
                            value: null,
                        }}
                    />
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

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                setShowTimePicker(true);
                            }}
                        >
                            <Text style={styles.text}>Выберите время приема {selectedTime.toLocaleTimeString()}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                let newTake = take;
                                newTake.datetime = newTake.datetime.toISOString();
                                setTake(newTake);
                                setTakes([...takes, newTake]);
                                saveTakes([...takes, newTake]);
                                router.back();
                            }}>
                            <Text style={styles.text}>Сохранить прием</Text>
                        </TouchableOpacity>
                    </View>
                    )}
                </View>
            
            {showTimePicker && (
                <DateTimePicker
                    mode="time"
                    value={selectedTime}
                    onChange={handleTimeChange}
                />
            )}

            {showDatePicker && (
                    <DateTimePicker
                        mode="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                    />
            )}
            </View>
        </SafeAreaView>
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

export default AddTake;