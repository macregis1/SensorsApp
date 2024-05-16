import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import * as Sensors from 'expo-sensors';
import Slider from '@react-native-community/slider';

// Mock API for controlling smart lights
const mockSmartLightsAPI = {
  setBrightness: (brightness) => {
    //console.log('Setting brightness to:', brightness);
    // Implement your logic to control smart lights here
  },
};

export default function LightSensor() {
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
      // Simulate controlling smart lights based on ambient light level
      mockSmartLightsAPI.setBrightness(0);
    } else {
      // Set background color to default when not covered
      setBackgroundColor('white'); // Change to your default color
      // Simulate controlling smart lights based on ambient light level
      mockSmartLightsAPI.setBrightness(lightLevel); // Adjust brightness based on ambient light level
    }
  }, [isScreenCovered, lightLevel]);

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

  const handleSmartLightsToggle = (value) => {
    setAdjustingThreshold(value);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.title}>Light Sensor</Text>
      <Text style={styles.lightLevel}>
        Light Brightness level: {isScreenCovered ? 'Screen covered' : lightLevel.toFixed(1) + ' lux'}
      </Text>
      <Text style={styles.threshold}>Screen is covered below {screenCoverThreshold} lux!</Text>
      {/* <View style={styles.adjustThresholdContainer}>
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
          onValueChange={handleSmartLightsToggle}
        />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  lightLevel: {
    fontSize: 20,
    marginBottom: 10,
    color: '#555',
  },
  threshold: {
    fontSize: 16,
    color: '#777',
  },
  adjustThresholdContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  adjustThresholdLabel: {
    fontSize: 18,
    marginBottom: 10,
    color: '#444',
  },
});
