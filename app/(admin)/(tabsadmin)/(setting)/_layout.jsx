import { StyleSheet, Text, Modal, TouchableOpacity, View, Image, ScrollView} from 'react-native'
import React, { useContext,  useState } from 'react'
import { Tabs } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import RouterButton from '../../../../components/RouterButton'
import { router } from 'expo-router'
import { AuthContext } from '../../../../contexts/AuthContext'
import { removeToken } from '../../../../contexts/Secure'
import { clearCourses } from '../../../../contexts/CoursesContext'
import { clearTakes } from '../../../../contexts/TakesContext'
import { clearMedicaments, getMedicaments, saveMedicaments } from '../../../../contexts/MedicamentContext'
import axios from 'axios'
import { API_URL_POST_MEDICAMENTS } from '../../../../constants/constants'
import { getToken } from '../../../../contexts/Secure'

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
      <RouterButton title="Выход"
                            handlePress={() => {
                            removeToken();
                            setUserInfo({role:null, isLoggedIn:false});
                            clearCourses();
                            clearTakes();
                            clearMedicaments();
                            router.replace('../../../');}}
                            containerStyle="w-full"
      />
      <RouterButton title="Сохранить все изменения на сервере"
                            handlePress={async () => {
                              const medicaments = await getMedicaments();
                              console.log(medicaments);
                              for(let i in medicaments) {
                                try {
                                  const response = await axios.put(API_URL_POST_MEDICAMENTS, medicaments[i], {
                                    headers: {
                                        'Authorization': `Bearer ${await getToken()}`,
                                        'Content-Type': 'application/json'
                                    },
                                  });
                                } catch (error) {
                                  alert('НЕВОЗМОЖНО ОТПРАВИТЬ НА СЕРВЕР НОВЫЙ МЕДИКАМЕНТ', error, medicaments[i]);
                                  console.error('НЕВОЗМОЖНО ОТПРАВИТЬ НА СЕРВЕР НОВЫЙ МЕДИКАМЕНТ', error, medicaments[i]);
                                }
                              }
                              saveMedicaments([]);
                            }}
                            containerStyle="w-full"
      />
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
                  <Text className="text-black mb-4">{`	          После авторизации администратора он попадает на главный экран `} <Text className="font-bold text-black ">{`"Поиск из открытых источников"`}</Text> {`.`}{'\n'}
                    <Image
                      source={require('@/assets/images/poiskOpen.png')}
                      className="w-[420px] h-[400px] items-center justify-center"
                      resizeMode="contain"
                    />
                    {`	          На экранной форме `} <Text className="font-bold text-black ">{`"Поиск из открытых источников"`}</Text> {` администратор может добавить новое лекарственное средство нажав на кнопку `} <Text className="font-bold text-black ">{`"Добавить новое лекарство"`}</Text> {`. При нажатии на кнопку у администратора откроется экранная форма `} <Text className="font-bold text-black ">{`"Добавление лекарства"`}</Text> {`,`}
                    <Image
                      source={require('@/assets/images/addMedicamentAdmin.png')}
                      className="w-[420px] h-[400px] items-center justify-center"
                      resizeMode="contain"
                    />
                    {`где после ввода всех полей можно будет добавить лекарственное средстов нажав на кнопку `} <Text className="font-bold text-black ">{`"Добавить"`}</Text> {'\n'}
                    {`	          Для поиска лекарственных средств из базы данных администратор должен нажать на кнопку `} <Text className="font-bold text-black ">{`"Поиск в базе"`}</Text> {` снизу экранной формы.`} 
                    <Image
                      source={require('@/assets/images/poiskBD.png')}
                      className="w-[420px] h-[400px] items-center justify-center"
                      resizeMode="contain"
                    />
                    {`В этой экранной форме администратор так же может добавить новое лекарственное средство нажав на кнопку `} <Text className="font-bold text-black ">{`"Добавить новое лекарство"`}</Text> {`. При нажатии на кнопку у администратора откроется экранная форма `} <Text className="font-bold text-black ">{`"Добавление лекарства"`}</Text> {`,`} 
                    <Image
                      source={require('@/assets/images/addMedicamentAdmin.png')}
                      className="w-[420px] h-[400px] items-center justify-center"
                      resizeMode="contain"
                    />
                    {`где после ввода всех полей можно будет добавить лекарственное средстов нажав на кнопку `} <Text className="font-bold text-black ">{`"Добавить"`}</Text> {`.`}{'\n'}
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
  )
}

export default SettingLayout

const styles = StyleSheet.create({})