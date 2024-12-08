import React, { useContext, useState } from 'react';
import { Text, View, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AuthContext } from '../../../../contexts/AuthContext';
import { removeToken } from '../../../../contexts/Secure';
import { clearCourses, clearDeletedCourses } from '../../../../contexts/CoursesContext';
import { clearDeletedTakes, clearTakes } from '../../../../contexts/TakesContext';
import { clearMedicaments } from '../../../../contexts/MedicamentContext';

const SettingLayout = () => {
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false); // Управление состоянием модального окна

  return (
    <SafeAreaView className="flex-1 bg-primary-back p-4">
      <Text className="text-xl font-bold mb-4 text-white">Настройки</Text>
      
      {/* Кнопка для открытия модального окна */}
      <TouchableOpacity
        className="w-full bg-primary-text py-4 px-6 rounded-md mb-4" // Увеличены отступы
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-center text-black text-lg">О разработчиках</Text> {/* Увеличен размер шрифта */}
      </TouchableOpacity>
      
      {/* Кнопка для выхода */}
      <TouchableOpacity
        className="w-full bg-primary-text py-4 px-6 rounded-md" // Увеличены отступы
        onPress={() => {
          removeToken();
          clearCourses();
          clearTakes();
          clearDeletedCourses();
          clearDeletedTakes();
          clearMedicaments();
          setUserInfo({ role: null, isLoggedIn: false });
          router.replace('../../..');
        }}
      >
        <Text className="text-center text-black text-lg">Выход</Text> {/* Увеличен размер шрифта */}
      </TouchableOpacity>

      {/* Модальное окно */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center">
          <View className="bg-primary-text rounded-lg p-6">
            <Text className="text-xl font-bold text-black mb-4">О разработчиках</Text>
            <Text className="text-black mb-4">
              Лабораторный практикум по дисциплине “Технологии программирования”{'\n'}
              Тема: “Мобильное приложение для поиска лекарств из открытых источников и напоминания об их приеме”{'\n'}
              {'\n'}
              Разработчики:{'\n'}
              Обучающиеся группы 6402-090301D{'\n'}
              Древина Мария Дмитриевна{'\n'}
              Жидяев Данила Алексеевич{'\n'}
              {'\n'}
              Руководитель:{'\n'}
              Зеленко Лариса Сергеевна

            </Text>
            <TouchableOpacity
              className="w-full bg-black py-4 px-6 rounded-md" // Увеличены отступы
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-center text-white text-lg">Закрыть</Text> {/* Увеличен размер шрифта */}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingLayout;
