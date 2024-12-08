import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
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

  return (
    <SafeAreaView className="flex-1 bg-primary-back p-4">
      <Text className="text-xl font-bold mb-4 text-white">Настройки</Text>
      <RouterButton title="О разработчиках" 
                            handlePress={() => router.push('/about')}
                            containerStyle="w-full"
      />
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
    </SafeAreaView>
  )
}

export default SettingLayout

const styles = StyleSheet.create({})