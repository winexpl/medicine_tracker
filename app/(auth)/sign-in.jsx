import { ScrollView, StyleSheet, Text, View, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link , router} from 'expo-router'
import {API_URL_LOGIN} from '../../constants/constants'
import axios from 'axios';
import { userRole, setUserRole, getUserRoleFromToken, saveToken, getToken, removeToken } from '../../context/AuthContext'



const SignIn = () => {
    // Отправляем на сервер
    const [form, setForm] = useState({
        username:'',
        password:''
    });
    
    const [loading, setLoading] = useState(false);  // Статус загрузки
    const [error, setError] = useState(null);  // Статус ошибки

    const handleButtonClickLogin = async () => {
        setLoading(true); // Включаем индикатор загрузки
        setError(''); // Очищаем предыдущие ошибки
        console.log("send POST LOGIN");
        try {
            // Отправляем запрос на сервер
            const response = await axios.post(API_URL_LOGIN, form, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            });
            if (response.data.token) {
                saveToken(response.data.token); // Сохраняем токен в SecureStorage
                const role = getUserRoleFromToken(response.data.token);
                console.log(role);
                getUserRoleFromToken(decoded.role); // Устанавливаем роль из токена
                setIsLoggedIn(true); // Статус авторизации
            }
            console.log(getUserRoleFromToken(response.data.token));
        } catch (err) {
            // Обработка ошибки запроса
            console.log(err)
            setError('Произошла ошибка при отправке данных.');
        } finally {
            setLoading(false); // Выключаем индикатор загрузки
        }
    };
    




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
                    value={form.username}
                    handleChangeText={(e) => setForm({...form, username: e})}
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
                    handlePress={() => {handleButtonClickLogin();} }
                    containerStyle='mt-7'
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