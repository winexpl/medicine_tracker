import { SplashScreen, Stack } from 'expo-router';
import { useFonts  } from 'expo-font';
import { useEffect, useState } from 'react';
import { MedicamentProvider } from '../../contexts/MedicamentContext';


const RootLayout = () => {
    
    return (
        <MedicamentProvider>
            <Stack>
                <Stack.Screen name="(tabsadmin)" options={{
                    headerShown: false
                }}/>
                <Stack.Screen name="medicamentInfoDb" options={{
                    headerShown: false
                }}/>
            </Stack>
        </MedicamentProvider>
        
);
}
export default RootLayout;