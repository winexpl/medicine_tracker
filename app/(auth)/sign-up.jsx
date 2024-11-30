import { ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link , router} from 'expo-router'
import { API_URL_REGISTRATION } from '../../constants/constants'
import axios from 'axios'
import { AuthContext, getUserRoleFromToken } from '../../contexts/AuthContext'
import { saveToken, getToken, removeToken } from '../../contexts/Secure'

const submit = () => {

}
const SignUp = () => {
  const { userInfo, setUserInfo } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name:'',
    login:'',
    password:'',
    role:'USER'
  })

  // Регистрируемся, получаем токен
  const handleButtonClickReg = async () => {
    setLoading(true); // Включаем индикатор загрузки
    console.log("send POST LOGIN");
    try {
        // Отправляем запрос на сервер
        form.login = form.login.trim();
        form.name = form.name.trim();
        form.password = form.password.trim();
        if(form.login === '' || form.name === '' || form.password === '') {
          console.error('Заполните все поля');
        }
        else {
        const response = await axios.post(API_URL_REGISTRATION, form, {
            headers: {
                'Content-Type': 'application/json'
            },
        });
        console.log(response.data);
        const token = response.data.token;
        if (token) {
            saveToken(token); // Сохраняем токен в SecureStorage
            const role = getUserRoleFromToken(token);
            console.log(role + " " + token);
            setUserInfo({role:role, isLoggedIn:true});
            if(role === "ADMIN") router.replace('/search');
            else router.replace('/schedule');
        }
      }
    } catch (err) {
        // Обработка ошибки запроса
        console.log(err);
        setError('Произошла ошибка при отправке данных.');
    } finally {
        setLoading(false); // Выключаем индикатор загрузки
    }
  };
  const [isSubmitting, setisSubmitting] = useState(false);
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
            Зарегистрируйтесь
            
          </Text>

          <FormField
            title='Ваше имя'
            value={form.name}
            handleChangeText={(e) => setForm({...form, name: e})}
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
          handlePress={() => handleButtonClickReg()}
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