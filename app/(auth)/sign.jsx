import { StyleSheet, Text, View, ScrollView, SafeAreaView, Image, StatusBar } from 'react-native'
import React from 'react'
import CustomButton from '../../components/CustomButton'
import { useState, useEffect } from 'react'
import { router } from 'expo-router'

const Sign = () => {
    const [dt, setDt] = useState(new Date().toLocaleString());

    useEffect(() => {
        let secTimer = setInterval( () => {
            setDt(new Date().toLocaleString());
        },1000);
    
        return () => clearInterval(secTimer);
    }, []);

    return (
        <SafeAreaView className="bg-secondary-back h-full.">
                <ScrollView contentContainerStyle={{ height:'100%' }}>
                    <View className="w-full justify-center items-center min-h-[85vh] px-6">
                        <Text className="text-3xl text-primary-text font-pbold">Welcome to {dt}</Text>
                        <Image
                            source={require('@/assets/images/logo.png')}
                            className="w-[350px] h-[200px] items-center justify-center"
                            resizeMode="contain"
                        />
                        <Text className="font-pmedium text-2xl text-secondary-text">
                            Присоединяйтесь к{' '}
                            <Text className="text-primary-text text-2xl">нам!</Text>
                        </Text>
                        <Text className="text-secondary-text text-center font-pextralight">
                            Используйте это приложение чтобы отслеживать приемы лекарственных средств
                        </Text>
                        <CustomButton
                            title="Вход"
                            handlePress={() => router.push('/sign-in')}
                            containerStyle="w-full mt-5"
                        ></CustomButton>
                        <CustomButton
                            title="Зарегистрироваться"
                            handlePress={() => router.push('/sign-up')}
                            containerStyle="w-full mt-5"
                        ></CustomButton>
                        <StatusBar style='light'/>
                    </View>
                </ScrollView>
            </SafeAreaView>
    )
}

export default Sign

const styles = StyleSheet.create({})