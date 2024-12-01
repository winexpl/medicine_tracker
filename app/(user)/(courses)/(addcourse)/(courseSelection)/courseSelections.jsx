
//ЭКРАННАЯ ФОРМА ПЕРЕМЕЩЕНИЕ ИЗ ФОРМЫ С ВЫБОРОМ КУРСА (ПОИСК ЛЕКАРСТВА)

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Используется иконка лупы

const MedicineSelectionScreen = () => {
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
    <TouchableOpacity style={styles.item}>
      <Text style={styles.itemText}>{item}</Text>
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
