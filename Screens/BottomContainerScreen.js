import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Sensors from 'expo-sensors';

//sensors imports
import StepCounter from '../components/StepCounter2';
import LocationTracker from '../components/LocationTracker';
//import LightSensor from '../components/LightSensor3';
import LightSensor from '../components/LightSensor';

const Tab = createBottomTabNavigator();

export default function BottomContainer(){
    const [lightLevel, setLightLevel] = useState(0);
    const [isScreenCovered, setIsScreenCovered] = useState(false);
    const [screenCoverThreshold, setScreenCoverThreshold] = useState(10); // Initial threshold
    const [backgroundColor, setBackgroundColor] = useState('white'); // Default background color
    useEffect(() => {
        const subscription = Sensors.LightSensor.addListener(({ illuminance }) => {
            setLightLevel(illuminance);
            checkScreenCover(illuminance);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    useEffect(() => {
        if (isScreenCovered) {
            // Set background color to black when covered
            setBackgroundColor('black');
        } else {
            // Set background color to default when not covered
            setBackgroundColor('white'); // Change to your default color
        }
    }, [isScreenCovered]);

    const checkScreenCover = (illuminance) => {
        if (illuminance <= screenCoverThreshold) {
            setIsScreenCovered(true);
        } else {
            setIsScreenCovered(false);
        }
    };


    return (
        <Tab.Navigator style={{ backgroundColor }} screenOptions={{ tabBarActiveTintColor: isScreenCovered ? 'black' : 'blue', tabBarActiveBackgroundColor: isScreenCovered ? 'black' : 'tomato', tabBarInactiveBackgroundColor: isScreenCovered ? 'black' : 'grey', headerShown: false}}>
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
        alignItems: 'center',
        justifyContent: 'center',
    },
});
//initialRouteName='Light Sensor'