import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import * as Sensors from 'expo-sensors';
import Slider from '@react-native-community/slider';

export default function LightSensor3() {
    const [lightLevel, setLightLevel] = useState(0);
    const [isScreenCovered, setIsScreenCovered] = useState(false);
    const [screenCoverThreshold, setScreenCoverThreshold] = useState(10); // Initial threshold
    const [adjustingThreshold, setAdjustingThreshold] = useState(false); // Flag to indicate if adjusting threshold mode is active
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

    const handleThresholdChange = (value) => {
        setScreenCoverThreshold(value);
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Text style={styles.title}>Light Sensor</Text>
            <Text style={styles.lightLevel}>
                Light Brightness level: {isScreenCovered ? 'Screen covered' : lightLevel.toFixed(1) + ' lux'}
            </Text>
            <Text style={styles.threshold}>Screen is covered below {screenCoverThreshold} lux!</Text>
            <View style={styles.adjustThresholdContainer}>
                <Text style={styles.adjustThresholdLabel}>Adjust Threshold:</Text>
                <Slider
                    style={{ width: '80%', marginTop: 10 }}
                    minimumValue={0}
                    maximumValue={100}
                    value={screenCoverThreshold}
                    onSlidingComplete={handleThresholdChange}
                    disabled={!adjustingThreshold}
                />
                {/* <Switch
                    style={{ marginTop: 10 }}
                    value={adjustingThreshold}
                    onValueChange={(value) => setAdjustingThreshold(value)}
                /> */}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    lightLevel: {
        fontSize: 18,
    },
    threshold: {
        fontSize: 12,
        marginTop: 10,
        fontStyle: 'italic',
    },
    adjustThresholdContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    adjustThresholdLabel: {
        fontSize: 16,
    },
});
