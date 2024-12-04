
//ЭКРАННАЯ ФОРМА ПЕРЕМЕЩЕНИЕ ИЗ ФОРМЫ С ВЫБОРОМ КУРСА (ПОИСК ЛЕКАРСТВА)

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Используется иконка лупы
import { API_URL_GET_MEDICAMENTS_SEARCH } from '../../../constants/constants';
import axios from 'axios';
import { getToken } from '../../../contexts/Secure';
import { router } from 'expo-router';

const MedicineSelectionScreen = () => {
  const [searchQuery, setSearchQuery] = useState(''); // Состояние для строки поиска
  const [filteredMedicines, setFilteredMedicines] = useState([]); // Состояние для найденных лекарств

  useEffect(() => {
    async function fetchMedicaments() {
      console.log("SEARCH!!!");
      const response = await axios.get(API_URL_GET_MEDICAMENTS_SEARCH + searchQuery, {
        headers: {
            'Authorization': `Bearer ${await getToken()}`,
        },
      });
      console.log(response);
      console.log(response.data);
      setFilteredMedicines(response.data);
      console.log(filteredMedicines);
    }
    fetchMedicaments();
  }, [searchQuery])
  // Фильтрация списка лекарств при вводе
  const handleSearch = (text) => {
    console.log("SEARCH!");
    setSearchQuery(text);
    
  };

  // Рендеринг одного элемента списка
  const renderMedicineItem = ({ item }) => (
    <TouchableOpacity className="p-4 border-b border-gray-200 bg-white" onPress={() => {
      console.log('item',item);
      router.push('coursesOne')}}>
      <Text className="text-base text-gray-800">
        {item.title} ({item.dosageForm})
      </Text>
      <Text className="text-base text-gray-800">
        Производитель: {item.sponsorName}
      </Text>
      <Text className="text-base text-gray-800">
        Активные вещества: {item.activeIngredients.map(ingredient => `${ingredient.title} (${ingredient.amount})`).join(", ")}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-primary-back p-4">
      {/* Заголовок экрана */}
      <Text className="font-bold mb-4 text-white">Выбор лекарства</Text>

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

export default MedicineSelectionScreen;
