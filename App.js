// App.js
import React from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import Register from './pages/Register';
import Login from './pages/Login';
import MinimumWage from './pages/MinimumWage';
import OvertimePay from './pages/OvertimePay';
import HolidayPay from './pages/HolidayPay';
import PremiumPay from './pages/PremiumPay';
import NightShiftDiff from './pages/NightShiftDiff';
import ThirteenthMonthPay from './pages/ThirteenthMonthPay';
import SIL from './pages/SIL';
import Admin from './pages/Admin'; // ✅ Import the Admin Page.
import Admin from './pages/SeparationPay';
import SeparationPay from './pages/SeparationPay';

const Stack = createNativeStackNavigator();

export default function App() {

    LogBox.ignoreAllLogs()
    
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Landing">
                <Stack.Screen
                    name="Landing"
                    component={LandingPage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={HomePage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Register"
                    component={Register}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="MinimumWage"
                    component={MinimumWage}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="OvertimePay"
                    component={OvertimePay}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="HolidayPay"
                    component={HolidayPay}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="PremiumPay"
                    component={PremiumPay}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="NightShiftDiff"
                    component={NightShiftDiff}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SIL"
                    component={SIL}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ThirteenthMonthPay"  
                    component={ThirteenthMonthPay}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SeparationPay"  
                    component={SeparationPay}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Admin"
                    component={Admin}
                    options={{ headerShown: false }} // ✅ Add the Admin Page
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
