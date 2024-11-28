import { ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link , router} from 'expo-router'

const submit = () => {

}
const SignUp = () => {
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
            Зарегестрируйтесь
            
          </Text>

          <FormField
            title='Ваше имя'
            value={form.username}
            handleChangeText={(e) => setForm({...form, username: e})}  
            otherStyles='mt-3'
          />

          <FormField
            title='Логин'
            value={form.login}
            handleChangeText={(e) => setForm({...form, login: e})}  
            otherStyles='mt-3'
            keyboardType='login'
          />

          <FormField
            title='Пароль'
            value={form.password}
            handleChangeText={(e) => setForm({...form, password: e})}  
            otherStyles='mt-3'
          />
        </View>
        <CustomButton
          title = 'Войти' 
          handlePress={() => router.push('/schedule')}
          containerStyle='mt-7'
          isLoading={isSubmitting}
        />
        
        <View className='pt-7 flex-row gap-4 items-center justify-center'>
          <Text className='font-psemibold'>У Вас уже есть учетная запись?</Text>
          <Link href='/sign-in' className='text-primary-text font-psemibold'>Войдите!</Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp

const styles = StyleSheet.create({})