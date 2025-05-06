// pages/LandingPage.js
import React from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const LandingPage = () => {
    const navigation = useNavigation();

    const handleLogoPress = () => {
        navigation.navigate('Home');
    };

    const handleLoginPress = () => {
        navigation.navigate('Login');
    };

    const handleCalculatorPress = () => {
        navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#2a2a2a', '#000']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.background}
            />
            <View style={styles.content}>
                <TouchableOpacity onPress={handleLogoPress}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
                        <Text style={styles.buttonText}>LOGIN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={handleCalculatorPress}>
                        <Text style={styles.buttonText}>WAGE CALCULATOR</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#000',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    logo: {
        width: 300,
        height: 200,
        marginBottom: 50,
    },
    buttonContainer: {
        marginTop: 20,
    },
    button: {
        backgroundColor: '#FFD700', // Bright Yellow
        paddingVertical: 15,
        borderRadius: 8,
        marginVertical: 10,
        width: 200, // Fixed width for both buttons
        height: 60, // Fixed height to ensure uniformity
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '900',
    },
});

export default LandingPage;