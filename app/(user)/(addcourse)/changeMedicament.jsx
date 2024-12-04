
//ЭКРАННАЯ ФОРМА ПЕРЕМЕЩЕНИЕ ИЗ ФОРМЫ С ВЫБОРОМ КУРСА (ПОИСК ЛЕКАРСТВА)

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Используется иконка лупы
import { API_URL_GET_MEDICAMENTS_SEARCH } from '../../../constants/constants';
import axios from 'axios';
import { getToken } from '../../../contexts/Secure';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

const MedicineSelectionScreen = () => {
  const [searchQuery, setSearchQuery] = useState(''); // Состояние для строки поиска
  const [filteredMedicines, setFilteredMedicines] = useState([]); // Состояние для найденных лекарств
  let course = useLocalSearchParams();

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
  // Фильтрация списка лекарств при вводе
  const handleSearch = (text) => {
    console.log("SEARCH!");
    setSearchQuery(text);
  };

  // Рендеринг одного элемента списка
  const renderMedicineItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => {
      console.log('item',item);
      course.medicamentId = item.id;
      router.push({
        pathname: '/coursesOne',
        params: course  // передаем объект курса в параметры
        });}}>
      <Text style={styles.itemText}>
        {item.title} ({item.dosageForm})
      </Text>
      <Text style={styles.itemText}>
        Производитель: {item.sponsorName}
      </Text>
      <Text style={styles.itemText}>
        Активные вещества: {item.activeIngredients.map(ingredient => `${ingredient.title} (${ingredient.amount})`).join(", ")}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Заголовок экрана */}
      <Text style={styles.header}>Выбор лекарства</Text>

      {/* Поле поиска */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
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
        style={styles.list}
        ListEmptyComponent={
          searchQuery.length > 0 ? (
            <Text style={styles.noResults}>Нет результатов</Text>
          ) : null
        }
      />
    </View>
  );
};

export default MedicineSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C2B',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  list: {
    flex: 1,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  noResults: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 16,
  },
});
