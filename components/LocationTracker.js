import React, { useState, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Alert } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

export default function LocationTrackerSensor() {
    const [location, setLocation] = useState(null);
    const [mapType, setMapType] = useState('standard');
    const [distance, setDistance] = useState(0);
    const [isInsideGeofence, setIsInsideGeofence] = useState(false); // Added state for geofence check
    const geofenceCoordinates = { latitude: -1.955966, longitude: 30.117136 }; // Define your geofence coordinates here
    //-1.9554115299786787, 30.104412772956874
    // const [geofenceCoordinates, setGeofenceCoordinates] = useState([
    //     { latitude: -1.955966, longitude: 30.117136 },
    //     { latitude: -1.9554115299786787, longitude: 30.104412772956874 }, // Second geofence coordinate
    // ]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
        })();
    }, []);

    useEffect(() => {
        if (location) {
            const coordinates = [
                { latitude: location.coords.latitude, longitude: location.coords.longitude },
                { latitude: location.coords.latitude + 0.001, longitude: location.coords.longitude + 0.001 }, // Example line coordinates
            ];
            const calculatedDistance = calculateDistance(coordinates);
            setDistance(calculatedDistance);

            // Check if current location is inside geofence
            const distanceFromGeofence = calculateDistanceBetweenPoints(
                location.coords.latitude,
                location.coords.longitude,
                geofenceCoordinates.latitude,
                geofenceCoordinates.longitude
            );
            setIsInsideGeofence(distanceFromGeofence < 100); // Adjust radius as needed
        }
    }, [location]);

    const toggleMapType = () => {
        setMapType(mapType === 'standard' ? 'hybrid' : 'standard');
    };

    const calculateDistance = (coordinates) => {
        let Distancing = 0;
        for (let i = 0; i < coordinates.length - 1; i++) {
            const lat1 = coordinates[i].latitude;
            const lon1 = coordinates[i].longitude;
            const lat2 = coordinates[i + 1].latitude;
            const lon2 = coordinates[i + 1].longitude;
            const distanceBetweenPoints = calculateDistanceBetweenPoints(lat1, lon1, lat2, lon2);
            Distancing += distanceBetweenPoints;
        }
        return Distancing;
    };

    const calculateDistanceBetweenPoints = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // Earth radius in meters
        const φ1 = lat1 * (Math.PI / 180);
        const φ2 = lat2 * (Math.PI / 180);
        const Δφ = (lat2 - lat1) * (Math.PI / 180);
        const Δλ = (lon2 - lon1) * (Math.PI / 180);

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // Distance in meters
        return distance;
    };

    useEffect(() => {
        // Example of geofence notification
        if (isInsideGeofence) {
            Alert.alert('Geofence Alert', 'You are inside the geofence area.');
        } else {
            Alert.alert('Geofence Alert', 'You are outside the geofence area.');
        }
    }, [isInsideGeofence]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>GPS Tracker</Text>
            <Text>Distance: {distance.toFixed(2)} meters</Text>
            {location && (
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                    mapType={mapType}
                >
                    <Marker
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                        title="You are here"
                        description="Your current location"
                    />
                    {/* {geofenceCoordinates.map((coordinate, index) => (
                        <Circle
                            key={index}
                            center={coordinate}
                            radius={50} // in meters, you can adjust this as needed
                            strokeColor="rgba(0, 0, 255, 0.5)"
                            fillColor="rgba(0, 0, 255, 0.2)"
                        />
                    ))} */}
                    <Circle
                        center={geofenceCoordinates}
                        radius={50} // in meters
                        strokeColor="rgba(0, 0, 255, 0.5)"
                        fillColor="rgba(0, 0, 255, 0.2)"
                    />
                </MapView>
            )}
            <TouchableOpacity onPress={toggleMapType} style={styles.toggleButton}>
                <Text>Switch to {mapType === 'standard' ? 'Satellite View' : 'Standard View'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'grey',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    map: {
        width: '100%',
        height: '75%',
    },
    toggleButton: {
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 5,
    },
});
