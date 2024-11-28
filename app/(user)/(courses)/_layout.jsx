import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { NavigationContainer } from '@react-navigation/native';
import CoursesActive from './coursesActive';
import CoursesInactive from './coursesInactive';




const CoursesLayout = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator className="">
                <Tab.Screen name="Активные" component={CoursesActive} />
                <Tab.Screen name="Завершенные" component={CoursesInactive} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default CoursesLayout

const styles = StyleSheet.create({})