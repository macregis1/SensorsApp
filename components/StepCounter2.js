import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Vibration } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import * as Notifications from 'expo-notifications';
import LottieView from 'lottie-react-native';

export default function App() {
    const [steps, setSteps] = useState(0);
    const [isCounting, setIsCounting] = useState(false);
    const [lastY, setLastY] = useState(0);
    const [lastTimestamp, setLastTimestamp] = useState(0);
    const AnimationRefRunning = useRef(null);
    const AnimationRefSitting = useRef(null);

    useEffect(() => {
        let subscription;
        Accelerometer.isAvailableAsync().then((result) => {
            if (result) {
                subscription = Accelerometer.addListener((accelerometerData) => {
                    const { y } = accelerometerData;
                    const threshold = 0.05; // Adjust the threshold for detecting steps
                    const timestamp = new Date().getTime();

                    if (
                        Math.abs(y - lastY) > threshold &&
                        !isCounting &&
                        timestamp - lastTimestamp > 1000 // Reduce cooldown time to 500 milliseconds
                    ) {
                        setIsCounting(true);
                        setLastY(y);
                        setLastTimestamp(timestamp);
                        setSteps((prevSteps) => prevSteps + 1);
                        Vibration.vibrate(100); // Reduce vibration duration to 100 milliseconds
                        sendNotification(); // Send notification when motion is detected
                        setTimeout(() => {
                            setIsCounting(false);
                        }, 800); // Reduce cooldown time to 800 milliseconds
                    }
                });
            } else {
                console.log('Accelerometer not available');
            }
        });
        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, [isCounting, lastY, lastTimestamp]);


    const resetSteps = () => {
        setSteps(0);
    };

    const sendNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Motion Detected',
                body: 'You have taken a step!',
            },
            trigger: null,
        });
    };

    return (
        <ScrollView>
            <SafeAreaView style={styles.container}>
                <View style={styles.containers}>
                <Text style={styles.title}>Step tracker</Text>
                <View style={styles.infoContainer}>
                    <View style={styles.stepsContainer}>
                        <Text style={styles.stepsText}>{steps}</Text>
                        <Text style={styles.stepsLabel}>Movements</Text>
                    </View>
                </View>
                </View>
                <View style={styles.animationContainer}>
                    {isCounting ? (
                        <LottieView
                            autoPlay
                            ref={AnimationRefRunning}
                            style={styles.animation}
                            source={require('./assets/AnimationMoving.json')}
                        />
                    ) : (
                        <LottieView
                            autoPlay
                            ref={AnimationRefSitting}
                            style={styles.animation}
                            source={require('./assets/AnimationIdle.json')}
                        />
                    )}
                </View>
                <TouchableOpacity style={styles.button} onPress={resetSteps}>
                    <Text style={styles.buttonText}>Reset</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    title: {
        fontSize: 28,
        marginBottom: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    infoContainer: {
        alignContent: 'center',
        marginBottom: 20,
    },
    stepsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 20,
    },
    stepsText: {
        fontSize: 26,
        color: '#3498db',
        fontWeight: 'bold',
        marginRight: 8,
    },
    stepsLabel: {
        fontSize: 24,
        color: '#555',
    },
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },

    animationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e0e0e0',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        elevation: 5,
        borderRadius: 250
    },

    animation: {
        width: 230,
        height: 240,
        backgroundColor: 'transparent',

    },
});
