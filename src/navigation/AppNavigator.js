import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ScheduleScreen from '../screens/Schedule/ScheduleScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Schedule">
                <Stack.Screen
                    name="Schedule"
                    component={ScheduleScreen}
                    options={{ title: 'Match Scheduler' }}
                />
                {/* Add additional screens here if needed */}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
