import * as SecureStorage from 'expo-secure-store';


// Сохранение токена в хранилище
export const saveToken = (token) => {
    try {
        SecureStorage.setItem('token', token);
        console.log('Token saved successfully');
    } catch (error) {
        console.error('Error saving token:', error);
    }
};

// Удаление токена их хранилища
export const removeToken = () => {
    try {
        SecureStorage.deleteItemAsync('token');
        console.log('Token removed successfully');
    } catch (error) {
        console.error('Error removing token:', error);
    }
};

// Получение токена из хранилища
export const getToken = async () => {
    try {
        const token = SecureStorage.getItemAsync('token');
        console.log(token);
        return token;
    } catch (error) {
        console.error('Ошибка получения токена:', error);
        return null;
    }
};