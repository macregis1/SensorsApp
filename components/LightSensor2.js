import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, Modal, TouchableOpacity } from 'react-native';
import * as Sensors from 'expo-sensors';
import Slider from '@react-native-community/slider';

export default function App() {
    const [lightLevel, setLightLevel] = useState(0);
    const [isScreenCovered, setIsScreenCovered] = useState(false);
    const [screenCoverThreshold, setScreenCoverThreshold] = useState(10); // Initial threshold
    const [adjustingThreshold, setAdjustingThreshold] = useState(false); // Flag to indicate if adjusting threshold mode is active
    const [backgroundColor, setBackgroundColor] = useState('white'); // Default background color
    const [showAlert, setShowAlert] = useState(false);

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
        if (isScreenCovered && !adjustingThreshold) {
            setShowAlert(true);
        }
    }, [isScreenCovered, adjustingThreshold]);

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

    const handleAlertDismiss = () => {
        setShowAlert(false);
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
                <Switch
                    style={{ marginTop: 10 }}
                    value={adjustingThreshold}
                    onValueChange={(value) => setAdjustingThreshold(value)}
                />
            </View>
            <Modal
                visible={showAlert}
                transparent
                animationType="fade"
                onRequestClose={handleAlertDismiss}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Warning</Text>
                        <Text style={styles.modalMessage}>Screen is covered!</Text>
                        <TouchableOpacity style={styles.dismissButton} onPress={handleAlertDismiss}>
                            <Text style={styles.dismissButtonText}>Dismiss</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        marginBottom: 20,
    },
    dismissButton: {
        backgroundColor: '#DDDDDD',
        padding: 10,
        borderRadius: 5,
    },
    dismissButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
});
