import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const ChangeMedicineForm = () => {
  const [name, setName] = useState('Аспирин Экспресс');
  const [form, setForm] = useState('Таблетка');
  const [activeSubstance, setActiveSubstance] = useState('Аспирин');
  const [dosage, setDosage] = useState('2');
  const [manufacturer, setManufacturer] = useState('Bayer');
  const [method, setMethod] = useState('Внутрь');

  const handleAddSubstance = () => {
    // Логика для добавления активного вещества
    console.log(`Добавлено вещество: ${activeSubstance}, дозировка: ${dosage}`);
  };

  const handleSubmit = () => {
    // Логика для отправки данных
    console.log({
      name,
      form,
      activeSubstance,
      dosage,
      manufacturer,
      method,
    });
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-xl font-bold mb-4">Добавление лекарства</Text>

      {/* Название */}
      <Text className="text-base mb-2">Название</Text>
      <TextInput
        className="bg-gray-200 p-2 rounded mb-4"
        value={name}
        onChangeText={setName}
        placeholder="Введите название"
      />

      {/* Форма выпуска */}
      <Text className="text-base mb-2">Форма выпуска</Text>
      <TextInput
        className="bg-gray-200 p-2 rounded mb-4"
        value={form}
        onChangeText={setForm}
        placeholder="Введите форму выпуска"
      />

      {/* Активное вещество */}
      <Text className="text-base mb-2">Активное вещество</Text>
      <View className="flex-row items-center space-x-2 mb-4">
        <TextInput
          className="flex-1 bg-gray-200 p-2 rounded"
          value={activeSubstance}
          onChangeText={setActiveSubstance}
          placeholder="Введите вещество"
        />
        <TextInput
          className="w-16 bg-gray-200 p-2 rounded text-center"
          value={dosage}
          onChangeText={setDosage}
          keyboardType="numeric"
          placeholder="мг"
        />
        <Text className="text-base">мг</Text>
      </View>

      {/* Производитель */}
      <Text className="text-base mb-2">Производитель</Text>
      <TextInput
        className="bg-gray-200 p-2 rounded mb-4"
        value={manufacturer}
        onChangeText={setManufacturer}
        placeholder="Введите производителя"
      />

      {/* Способ применения */}
      <Text className="text-base mb-2">Способ применения</Text>
      <TextInput
        className="bg-gray-200 p-2 rounded mb-4"
        value={method}
        onChangeText={setMethod}
        placeholder="Введите способ применения"
      />

      <TouchableOpacity
        className="bg-gray-400 p-4 rounded items-center"
        onPress={handleSubmit}
      >
        <Text className="text-base text-white">Изменить</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-gray-400 p-4 rounded items-center"
        onPress={handleSubmit}
      >
        <Text className="text-base text-white">Удалить</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangeMedicineForm;
