import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';

const AddMedicineForm = () => {
  const [name, setName] = useState('Аспирин Экспресс');
  const [form, setForm] = useState('Таблетка');
  const [manufacturer, setManufacturer] = useState('Bayer');
  const [method, setMethod] = useState('Внутрь');
  const [activeSubstance, setActiveSubstance] = useState('');
  const [dosage, setDosage] = useState('');
  const [activeSubstances, setActiveSubstances] = useState([
    { name: 'Аспирин', dosage: '2' }, // Изначально добавленная строка
  ]);

  const handleAddSubstance = () => {
    if (activeSubstance.trim() === '' || dosage.trim() === '') {
      alert('Введите активное вещество и дозировку!');
      return;
    }

    setActiveSubstances([...activeSubstances, { name: activeSubstance, dosage }]);
    setActiveSubstance(''); // Очищаем поле ввода
    setDosage('');
  };

  const handleRemoveSubstance = (index) => {
    const updatedSubstances = activeSubstances.filter((_, i) => i !== index);
    setActiveSubstances(updatedSubstances);
  };

  const handleSubmit = () => {
    console.log({
      name,
      form,
      manufacturer,
      method,
      activeSubstances,
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

      {/* Список активных веществ */}
      <Text className="text-base mb-2">Активное вещество</Text>
      {activeSubstances.map((substance, index) => (
        <View
          key={index}
          className="flex-row items-center justify-between bg-gray-200 p-2 rounded mb-2"
        >
          <Text className="text-base">{`${substance.name} ${substance.dosage} мг`}</Text>
          <TouchableOpacity
            className="bg-red-400 px-2 py-1 rounded"
            onPress={() => handleRemoveSubstance(index)}
          >
            <Text className="text-white">Удалить</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Поля для добавления нового вещества */}
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

      <TouchableOpacity
        className="bg-gray-300 p-2 rounded items-center mb-4"
        onPress={handleAddSubstance}
      >
        <Text className="text-base text-gray-700">Добавить действующее вещество</Text>
      </TouchableOpacity>

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

      {/* Кнопка Добавить */}
      <TouchableOpacity
        className="bg-gray-400 p-4 rounded items-center"
        onPress={handleSubmit}
      >
        <Text className="text-base text-white">Добавить</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddMedicineForm;
