import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { getProfileByEmail } from '../services/ProfileService';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const profile = await getProfileByEmail(email);

            if (!profile) {
                Alert.alert('Login Failed', 'Invalid email or password.');
                console.log('Profile not found');
                return;
            }

            console.log('Fetched Profile:', profile);

            const inputPassword = password.trim();
            const storedPassword = (profile.password || '').trim();

            console.log('Input Password:', inputPassword);
            console.log('Stored Password:', storedPassword);

            if (inputPassword !== storedPassword) {
                Alert.alert('Login Failed', 'Invalid email or password.');
                console.log('Invalid password');
                return;
            }

            console.log('Login successful:', profile);

            // Save the login state to AsyncStorage
            await AsyncStorage.setItem('loggedInUser', JSON.stringify(profile));
            console.log('User saved to AsyncStorage:', JSON.stringify(profile));

            navigation.navigate('Admin');

        } catch (error) {
            Alert.alert('Error', 'An unexpected error occurred.');
            console.error('Login error:', error);
        }
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

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>LOGIN</Text>
                </TouchableOpacity>

                <Text style={styles.signUpText}>
                    Login to proceed Admin. <Text style={styles.signUpLink}>Login now!</Text>
                    </Text>

{/* New Back to Landing Button */}
<TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Landing')}>
    <Text style={styles.backButtonText}>Go back</Text>
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
    loginButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginBottom: 20,
    },
    loginButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 18,
    },
    signUpText: {
        color: '#fff',
        fontSize: 16,
    },
    signUpLink: {
        fontWeight: 'bold',
        color: '#fff',
    },

    backButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderColor: '#FFD700',
        borderWidth: 1,
    },
    backButtonText: {
        color: '#FFD700',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Login;
