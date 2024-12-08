import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Используется иконка лупы
import { MedicamentContext } from '../../../contexts/MedicamentContext';
import axios from 'axios';
import { API_URL_GET_MEDICAMENTS_SEARCH } from '../../../constants/constants';
import { getToken } from '../../../contexts/Secure';
import { router } from 'expo-router';
import uuid from 'react-native-uuid';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState(''); // Состояние для строки поиска
  const [filteredMedicines, setFilteredMedicines] = useState([]); // Состояние для найденных лекарств
  const { medicaments, setMedicaments } = useContext(MedicamentContext);
  // Фильтрация списка лекарств при вводе
  const handleSearch = (text) => {
    console.log("SEARCH!");
    setSearchQuery(text);
  };

  useEffect(() => {
    async function fetchMedicaments() {
      try {
        console.log("SEARCH!!!");
        const response = await axios.get(API_URL_GET_MEDICAMENTS_SEARCH + searchQuery, {
          headers: {
              'Authorization': `Bearer ${await getToken()}`,
          },
        });
        console.log(response.data);
        setFilteredMedicines(response.data);
        console.log(filteredMedicines);
      } catch (error) {
        console.error('Нет доступа к серверу, невозможно получить список медикаментов: ', error);
      }
      
    }
    fetchMedicaments();
  }, [searchQuery])

  // Рендеринг одного элемента списка
  const renderMedicineItem = ({ item }) => (
    <TouchableOpacity className="p-4 border-b border-gray-200 bg-white" onPress={() => {
      router.push({
        pathname: '/medicamentInfoDb',
        params: {medicament:JSON.stringify(item)}  // передаем объект курса в параметры
      });
    }}>
      <Text className="text-base text-gray-800">{item.title}</Text>
      <Text className="text-gray-800 text-xs">{item.id}</Text>
      <Text className="text-base text-gray-800">
        Производитель: {item.sponsorName}
      </Text>
      <Text className="text-base text-gray-800">
        Активные вещества: {item.activeIngredients.map(ingredient => `${ingredient.title} (${ingredient.amount})`).join(", ")}
      </Text>
      <Text className="text-base text-gray-800">
        Форма выпуска: {item.dosageForm}
      </Text>
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
      <TouchableOpacity className="bg-blue-500 rounded-lg py-3 px-6 items-center" onPress={() => {
        router.push({
          pathname: '/medicamentInfoDb',
          params: {medicament:JSON.stringify({id:uuid.v4(), 
              activeIngredients: [], 
              title:'',
              dosageForm:'',
              sponsorName:''}
          )}  // передаем объект курса в параметры
        });
      }}>
        <Text className="text-white text-lg font-semibold">Добавить новое лекарство</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Search;
