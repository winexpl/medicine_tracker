import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getMedicaments, MedicamentContext, saveMedicaments } from '../../contexts/MedicamentContext';
import uuid from 'react-native-uuid';

const AddMedicineForm = () => {
  const { medicaments, setMedicaments } = useContext(MedicamentContext);

  const localParams = useLocalSearchParams();

  const [medicament, setMedicament] = useState(JSON.parse(localParams.medicament));

  const [name, setName] = useState(medicament.title);
  const [form, setForm] = useState(medicament.dosageForm);
  const [manufacturer, setManufacturer] = useState(medicament.sponsorName);
  const [activeSubstance, setActiveSubstance] = useState('');
  const [dosage, setDosage] = useState('');
  const [activeSubstances, setActiveSubstances] = useState(medicament.activeIngredients);

  const handleAddSubstance = () => {
    if (activeSubstance.trim() === '' || dosage.trim() === '') {
      alert('Введите активное вещество и дозировку!');
      return;
    }
    setActiveSubstances([...activeSubstances, { title: activeSubstance, amount: dosage }]);
    setActiveSubstance(''); // Очищаем поле ввода
    setDosage('');
  };

  const handleRemoveSubstance = (index) => {
    const updatedSubstances = activeSubstances.filter((_, i) => i !== index);
    setActiveSubstances(updatedSubstances);
  };

  const handleSubmit = async () => {
    console.log(1);
    let newMedicament = { id: medicament.id, activeIngredients: activeSubstances,
      dosageForm: form, title: name, sponsorName: manufacturer};
    console.log(2);
    const oldMedicaments = await getMedicaments();
    console.log(newMedicament);
    saveMedicaments([...oldMedicaments, newMedicament]);
    router.back();
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-xl font-bold mb-4">Добавление лекарства</Text>

      {/* Название */}
      <Text className="text-base mb-2">Название</Text>
      <TextInput
        className="bg-gray-200 p-2 rounded mb-4"
        value={name}
        onChangeText={(name) => {
          setName(name);
        }}
        placeholder="Введите название"
      />

      {/* Форма выпуска */}
      <Text className="text-base mb-2">Форма выпуска</Text>
      <TextInput
        className="bg-gray-200 p-2 rounded mb-4"
        value={form}
        onChangeText={(form) => {
          setForm(form);
        }}
        placeholder="Введите форму выпуска"
      />

      {/* Список активных веществ */}
      <Text className="text-base mb-2">Активное вещество</Text>
      {activeSubstances.map((substance, index) => (
        <View
          key={index}
          className="flex-row items-center justify-between bg-gray-200 p-2 rounded mb-2"
        >
          <Text className="text-base">{`${substance.title} ${substance.amount} мг`}</Text>
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
