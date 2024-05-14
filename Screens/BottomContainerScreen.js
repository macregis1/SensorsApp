import React from 'react';
import { StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//sensors imports
import StepCounter from '../components/StepCounter2';
import LocationTracker from '../components/LocationTracker';
import LightSensor from '../components/LightSensor3';

const Tab = createBottomTabNavigator();

export default function BottomContainer(){
    return (
        <Tab.Navigator screenOptions={{ tabBarActiveTintColor: 'blue', tabBarActiveBackgroundColor: 'tomato', tabBarInactiveBackgroundColor: 'grey', headerShown: false}}>
            <Tab.Screen
                name= "Motion Tracker"
                component={StepCounter}
                options={{
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="blind" color={color} />,
                }} />
            <Tab.Screen
                name="Location Tracker"
                component={LocationTracker}
                options={{
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="globe" color={color} />,
                }}
            />
            <Tab.Screen
                name="Light Sensor"
                component={LightSensor}
                options={{
                    tabBarIcon: ({ color }) => <FontAwesome size={28} name="lightbulb-o" color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});