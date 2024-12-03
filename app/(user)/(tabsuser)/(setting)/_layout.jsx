import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import RouterButton from '../../../../components/RouterButton'
import { router } from 'expo-router'
import { AuthContext } from '../../../../contexts/AuthContext'
import { removeToken } from '../../../../contexts/Secure'
import { clearCourses } from '../../../../contexts/CoursesContext'
import { clearTakes } from '../../../../contexts/TakesContext'
import { clearMedicaments } from '../../../../contexts/MedicamentContext'

const SettingLayout = () => {
  const { userInfo, setUserInfo } = useContext(AuthContext);
  return (
    <SafeAreaView>
      <RouterButton title="О разработчиках"
                            handlePress={() => router.push('/about')}
                            containerStyle="w-full"
      />
      <RouterButton title="Выход"
                            handlePress={() => {
                              removeToken();
                              clearCourses();
                              clearTakes();
                              clearMedicaments();
                              setUserInfo({role:null, isLoggedIn:false});
                              router.replace('../../..');}}
                            containerStyle="w-full"
      />
    </SafeAreaView>
  )
}

export default SettingLayout

const styles = StyleSheet.create({})