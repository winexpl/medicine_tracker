import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import RouterButton from '../../../components/RouterButton'
import { router } from 'expo-router'
import { removeToken } from '../../../contexts/AuthContext'

const SettingLayout = () => {
  const { userInfo, setUserInfo } = useAuth();
  return (
    <SafeAreaView>
      <RouterButton title="О разработчиках"
                            handlePress={() => router.push('/about')}
                            containerStyle="w-full"
      />
      <RouterButton title="Выход"
                            handlePress={() => {
                              removeToken();
                              setUserInfo({role:null, isLoggedIn:false});
                              router.replace('../../');}}
                            containerStyle="w-full"
      />
    </SafeAreaView>
  )
}

export default SettingLayout

const styles = StyleSheet.create({})