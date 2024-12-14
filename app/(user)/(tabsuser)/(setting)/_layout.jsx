import React, { useContext, useState } from 'react';
import { Text, View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AuthContext } from '../../../../contexts/AuthContext';
import { removeToken } from '../../../../contexts/Secure';
import { clearCourses, clearDeletedCourses } from '../../../../contexts/CoursesContext';
import { clearDeletedTakes, clearTakes } from '../../../../contexts/TakesContext';
import { clearMedicaments } from '../../../../contexts/MedicamentContext';

const SettingLayout = () => {
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-primary-back p-4">
      <Text className="text-xl font-bold mb-4 text-white">Настройки</Text>
      
      <TouchableOpacity
        className="w-full bg-primary-text py-4 px-6 rounded-md mb-4"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-center text-black text-lg">О разработчиках</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full bg-primary-text py-4 px-6 rounded-md mb-4"
        onPress={() => setModalVisible1(true)}
      >
        <Text className="text-center text-black text-lg">О системе</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full bg-primary-text py-4 px-6 rounded-md"
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
        <Text className="text-center text-black text-lg">Выход</Text>
      </TouchableOpacity>
      

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center">
          <View className="bg-primary-text rounded-lg p-6">
            <Text className="text-xl font-bold text-black mb-4">{`О разработчиках`}</Text>
            <Text className="text-black mb-4">{`Лабораторный практикум по дисциплине “Технологии программирования”`}{'\n'}
              {`Тема: “Мобильное приложение для поиска лекарств из открытых источников и напоминания об их приеме”`}{'\n'}
              {'\n'}
              {`Разработчики:`}{'\n'}
              {`Обучающиеся группы 6402-090301D`}{'\n'}
              {`Древина Мария Дмитриевна`}{'\n'}
              {`Жидяев Данила Алексеевич`}{'\n'}
              {'\n'}
              {`Руководитель:`}{'\n'}
              {`Зеленко Лариса Сергеевна`}</Text>
            <TouchableOpacity
              className="w-full bg-black py-4 px-6 rounded-md"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-center text-white text-lg">{`Закрыть`}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => setModalVisible1(false)}
      >
        <ScrollView>
        <View className="flex-1 justify-center items-center">
          <View className="bg-primary-text rounded-lg p-6">
            <Text className="text-xl font-bold text-black mb-4">{`О системе`}</Text>
            <Text className="text-black mb-4">{`	          После авторизации пользователя он попадает на главный экран `}<Text className="font-bold text-black ">{`"Расписание".`}</Text>{'\n'}
            {`	          Для того чтобы добавить курс следует перейти во вкладку активных курсов по кнопке`} <Text className="font-bold text-black ">{`"Курсы"`}</Text> {`находящейся снизу экранной формы и нажать на кнопку `}<Text className="font-bold text-black ">{`"Добавить курс"`}</Text> {`. После нажатия на кнопку пользователя переместит в меню выбора типа курса. Пользоавтель может выбрать один из 3 представленных типа курсов. После выбора типа курса пользователь должен выбрать интересующий его препарат. Затем, как препарат был выбран, пользователя в зависимости от выбранного курса перемещает на экранную форму добавления курса, где тот должен выбрать дату начала и окончания приема, периодичность/дни недели, дозу лекарственного средства добавить необходимое количество приемов, выбрать время этих приемов и выбрать режим приема. Как все поля будут заполнены пользователем, он должен нажать кнопку `} <Text className="font-bold text-black ">{`"ОК"`}</Text> {`, после чего курс будет успешно добавлен в активные приемы, так же все выбранные приемы пользователем будут отображаться в расписании в указанных днях. `}{'\n'}
            {`	          Так же можно выбрать курс приема ЛС по необходимости. В этом случае пользователя перемести на экранную форму `} <Text className="font-bold text-black ">{`"Расписание"`}</Text> {`, где он сможет добавить прием самостоятельно нажав на кнопку `} <Text className="font-bold text-black ">{`"Добавить прием"`}</Text> {`. Там он должен выбрать дату и время приема, затем сохранить прием нажатием на кнопку `} <Text className="font-bold text-black ">{`"Сохранить прием"`}</Text> {`.`}{'\n'}
            {`	          Информацию о курсе можно посмотреть нажав на сам курс во вкладке `} <Text className="font-bold text-black ">{`"Курсы"`}</Text> {` как в активных, так и в завершенных. Активный курс можно завершить, а завершенный курс можно удалить. `}{'\n'}
              </Text>
            <TouchableOpacity
              className="w-full bg-black py-4 px-6 rounded-md"
              onPress={() => setModalVisible1(false)}
            >
              <Text className="text-center text-white text-lg">{`Закрыть`}</Text>
            </TouchableOpacity>
          </View>
        </View>
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingLayout;
