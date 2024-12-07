import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Используется иконка лупы

const Search = () => {
  const [searchQuery, setSearchQuery] = useState(''); // Состояние для строки поиска
  const [filteredMedicines, setFilteredMedicines] = useState([]); // Состояние для найденных лекарств

  // Данные о лекарствах
  const medicines = [
    'Аспирин 100 мг Байер',
    'Аспирин 500 мг Реневал',
    'Анальгин 50 мг',
    'Парацетамол 500 мг',
    'Ибупрофен 200 мг',
  ];

  // Фильтрация списка лекарств при вводе
  const handleSearch = (text) => {
    setSearchQuery(text);

    if (text.trim() === '') {
      setFilteredMedicines([]);
      return;
    }

    const results = medicines.filter((medicine) =>
      medicine.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredMedicines(results);
  };

  // Рендеринг одного элемента списка
  const renderMedicineItem = ({ item }) => (
    <TouchableOpacity className="p-4 border-b border-gray-200 bg-white">
      <Text className="text-base text-gray-800">{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100 p-4">
      {/* Заголовок экрана */}
      <Text className="text-xl font-bold mb-4 text-gray-800">Выбор лекарства</Text>

      {/* Поле поиска */}
      <View className="flex-row items-center bg-white border border-gray-300 rounded-lg px-3 py-2 mb-4">
        <Icon name="search" size={20} color="#888" className="mr-2" />
        <TextInput
          className="flex-1 text-base text-gray-800"
          placeholder="Введите название лекарства"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Список найденных лекарств */}
      <FlatList
        data={filteredMedicines}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMedicineItem}
        className="flex-1"
        ListEmptyComponent={
          searchQuery.length > 0 ? (
            <Text className="text-center text-gray-500 text-base mt-4">Нет результатов</Text>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
