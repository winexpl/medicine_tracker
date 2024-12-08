import { ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import React, { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { Link, router } from 'expo-router';
import { API_URL_LOGIN } from '../../constants/constants';
import axios from 'axios';
import { getUserRoleFromToken, AuthContext } from '../../contexts/AuthContext';
import { saveToken, getToken, removeToken } from '../../contexts/Secure';
import { replace } from 'expo-router/build/global-state/routing';
import ErrorModal from '../../components/ErrorModalTwo';  // Импортируем модальное окно ошибок

const SignIn = () => {
    const [form, setForm] = useState({
        username: '',
        password: ''
    });
    const { userInfo, setUserInfo } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);  // Статус загрузки
    const [error, setError] = useState(null);  // Статус ошибки

    // Стейты для модального окна ошибки
    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const showError = (message) => {
        setErrorMessage(message);
        setErrorModalVisible(true);
    };

    const hideError = () => {
        setErrorModalVisible(false);
    };

    // Здесь получаем токен с сервера
    const handleButtonClickLogin = async () => {
        setLoading(true); // Включаем индикатор загрузки
        setError(''); // Очищаем предыдущие ошибки
        console.log("send POST LOGIN");

        form.username = form.username.trim();
        form.password = form.password.trim();

        if (form.username === '' || form.password === '') {
            showError('Заполните все поля!');
        } else {
            try {
                // Отправляем запрос на сервер
                const response = await axios.post(API_URL_LOGIN, form, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                });
                console.log(response.data);
                const token = await response.data.token;
                if (token) {
                    saveToken(token); // Сохраняем токен в SecureStorage
                    const role_ = getUserRoleFromToken(token);
                    setUserInfo({ role: role_, isLoggedIn: true });
                    router.replace('../../');
                }
            } catch (err) {
                // Обработка ошибки запроса
                showError('Неправильно введены Логин или Пароль!');
                setError('Произошла ошибка при отправке данных.');
            } finally {
                setLoading(false); // Выключаем индикатор загрузки
            }
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
                        handleChangeText={(e) => setForm({ ...form, username: e })}
                        otherStyles='mt-7'
                        keyboardType='login'
                    />

                    <FormField
                        title='Пароль'
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e })}
                        otherStyles='mt-7'
                    />
                </View>
                <CustomButton
                    title='Войти'
                    handlePress={() => handleButtonClickLogin()}
                    containerStyle='mt-7'
                />
                <View className='pt-7 flex-row gap-4 items-center justify-center'>
                    <Text className='font-psemibold'>У Вас нет учетной записи?</Text>
                    <Link replace href='/sign-up' className='text-primary-text font-psemibold'>Зарегестрируйтесь!</Link>
                </View>
            </ScrollView>

            {/* Модальное окно для ошибок */}
            <ErrorModal
                visible={errorModalVisible}
                message={errorMessage}
                onClose={hideError}
            />
        </SafeAreaView>
    );
};

export default SignIn;

const styles = StyleSheet.create({});
