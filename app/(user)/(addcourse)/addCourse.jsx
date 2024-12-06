
//ЭКРАННАЯ ФОРМА С ВЫБОРОМ ОДНОГО ИЗ 3 ВАРИАНТОВ ПРИЕМА КУРСА (ВЫБОР КУРСА)

import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router'
import { useState } from 'react';
import uuid from 'react-native-uuid';


const AddCourse = () => {
  const course = {id:uuid.v4(),accountId:'',medicamentId:'',
        dose:0,startDate: (new Date()).toLocaleDateString("en-CA"),
        endDate:new Date().toLocaleDateString("en-CA"),typeCourse:0,weekday:0,period:1,regimen:'',
        numberMedicine:0,schedule:[],state:'Активный'};

  return (
    <SafeAreaView className="flex-1 bg-primary-back p-4">

      <TouchableOpacity className="bg-primary-text p-4 my-2 border border-gray-300 rounded" onPress={() => {
        course.typeCourse = 2;
        router.push({
          pathname: 'changeMedicament',
          params: course  // передаем объект курса в параметры
        }); }}>
        <Text className="text-base text-gray-800">Составить расписание на 1 день и выбрать периодичность</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-primary-text p-4 my-2 border border-gray-300 rounded" onPress={() => {
        course.typeCourse = 1;
        router.push({
          pathname: 'changeMedicament',
          params: course  // передаем объект курса в параметры
        }); }}>
        <Text className="text-base text-gray-800">Составить расписание на неделю</Text>
      </TouchableOpacity>

      <TouchableOpacity className="bg-primary-text p-4 my-2 border border-gray-300 rounded" onPress={() => {
        course.typeCourse = 3;
        router.push({
          pathname: 'changeMedicament',
          params: course  // передаем объект курса в параметры
        }); }}>
        <Text className="text-base text-gray-800">Принимать лекарственные средства по необходимости</Text>
      </TouchableOpacity>
      
    </SafeAreaView>
  );
};

export default AddCourse;
