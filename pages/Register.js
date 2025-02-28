// pages/Register.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Register = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {
        console.log('Register clicked');
    };

    const handleLoginRedirect = () => {
        navigation.navigate('Login');
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
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Name"
                        placeholderTextColor="#000"
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#000"
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#000"
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                    <Text style={styles.registerButtonText}>REGISTER</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleLoginRedirect}>
                    <Text style={styles.loginText}>
                        Already have an account? <Text style={styles.loginLink}>Login</Text>
                    </Text>
                </TouchableOpacity>
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
        paddingHorizontal: 20,
        marginTop: -80, // Moves the container higher
    },
    logo: {
        width: 350,
        height: 200,
        marginBottom: 20,
    },
    inputContainer: {
        width: '80%',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 15,
        fontSize: 16,
        color: '#000',
        elevation: 3,
    },
    registerButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginBottom: 20,
    },
    registerButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 18,
    },
    loginText: {
        color: '#fff',
        fontSize: 16,
    },
    loginLink: {
        fontWeight: 'bold',
        color: '#fff',
    },
});

export default Register;
