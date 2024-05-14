import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, Button } from 'react-native';
import * as Animatable from 'react-native-animatable';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SplashScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Animatable.Image animation="bounce" duration={1500} source={require('./images/sensor.png')}
                style={styles.logo} resizeMode="cover"/>
            </View>
            <Animatable.View style={styles.footer} animation="fadeInUpBig">
                <Text style={styles.title}>Stay up-to-date with everyone</Text>
                <Text style={styles.text}>keep up with mobile sensory</Text>
                <View style={styles.button}>
                    <TouchableOpacity
                    onPress={() => navigation.navigate('Container')} 
                    style={[styles.signIn,{
                        borderColor: '#009387', borderWidth:1, marginTop: 15, backgroundColor: '#08d4c4'}]}>
                        <Text style={[styles.textSign, {color:'#fff'}]}>Get started</Text>
                        <MaterialIcons 
                        name="navigate-next"
                        color="#fff"
                        size={20}
                    />
                        {/* <Button title="Get started >" color={'#08d4c4'} style={styles.signIn} onPress={() => navigation.navigate('SignInScreen')}/> */}
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
};

export default SplashScreen;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.28;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387'
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 50,
    },
    logo: {
        width: height_logo,
        height: height_logo,
        borderRadius: 200
    },
    title: {
        color: '#05375a',
        fontSize: 30,
        fontWeight: 'bold',
    },
    text: {
        color: 'grey',
        marginTop: 5
    },
    button: {
        alignItems: 'flex-end',
        marginTop: 30
    },
    signIn: {
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row'
    },
    textSign: {
        color: 'white',
        fontWeight: 'bold',
    }
});