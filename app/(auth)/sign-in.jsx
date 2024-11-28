import { ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link , router} from 'expo-router'

const submit = () => {

}
const SignIn = () => {
  const [form, setForm] = useState({
    login:'',
    password:''
  })
  const [isSubmitting, setisSubmitting] = useState(false)
  return (
    <SafeAreaView className='bg-secondary-back h-full'>
      <ScrollView className='px-6'>
        <View className='w-full'>
          <Image
            source={require('@/assets/images/logo-h.png')}
            className="w-[350px] h-[200px] items-center justify-center"
            resizeMode="contain"
          />
          <Text className='font-pmedium text-lg text-secondary-text text-center'>
            Войдите в систему
          </Text>
          <FormField
            title='Логин'
            value={form.login}
            handleChangeText={(e) => setForm({...form, login: e})}  
            otherStyles='mt-7'
            keyboardType='login'
          />

          <FormField
            title='Пароль'
            value={form.password}
            handleChangeText={(e) => setForm({...form, password: e})}  
            otherStyles='mt-7'
          />
        </View>
        <CustomButton
          title = 'Войти'
          handlePress={() => router.push('/schedule')}
          containerStyle='mt-7'
          isLoading={isSubmitting}
        />
        <View className='pt-7 flex-row gap-4 items-center justify-center'>
          <Text className='font-psemibold'>У Вас нет учетной записи?</Text>
          <Link href='/sign-up' className='text-primary-text font-psemibold'>Зарегестрируйтесь!</Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn

const styles = StyleSheet.create({})