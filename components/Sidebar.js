// components/Sidebar.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Sidebar = ({ isOpen, toggleSidebar, onViewHolidays, onAddHoliday, onNavigateHome, navigation }) => {
    
    const handleLogout = async () => {
        Alert.alert(
            'Logout Confirmation',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            console.log('Clearing AsyncStorage...');
                            await AsyncStorage.removeItem('loggedInUser');
                            console.log('Logout successful. Navigating to Login page...');
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        } catch (error) {
                            console.error('Error during logout:', error);
                        }
                    },
                },
            ]
        );
    };

    return (
        <Animated.View style={[styles.sidebar, { width: isOpen ? 200 : 60 }]}>
            <TouchableOpacity style={styles.menuIconContainer} onPress={toggleSidebar}>
                <Ionicons name={isOpen ? "chevron-back" : "menu"} size={24} color="#FFD700" />
            </TouchableOpacity>

            {isOpen && (
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.sidebarTitle}>Admin Panel</Text>
                </View>
            )}

            <View style={styles.menuContainer}>
                <TouchableOpacity style={styles.sidebarButton} onPress={onViewHolidays}>
                    <Ionicons name="calendar-outline" size={20} color="#FFD700" />
                    {isOpen && <Text style={styles.sidebarButtonText}>View Holidays</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.sidebarButton} onPress={onAddHoliday}>
                    <Ionicons name="add-circle-outline" size={20} color="#FFD700" />
                    {isOpen && <Text style={styles.sidebarButtonText}>Add New Holiday</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.sidebarButton} onPress={onNavigateHome}>
                    <Ionicons name="calculator-outline" size={20} color="#FFD700" />
                    {isOpen && <Text style={styles.sidebarButtonText}>Calculator</Text>}
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color="#fff" />
                {isOpen && <Text style={styles.logoutButtonText}>LOGOUT</Text>}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    sidebar: {
        height: '100%',
        backgroundColor: '#1a1a1a',
        paddingVertical: 30,
        paddingHorizontal: 10,
        borderRightWidth: 1,
        borderColor: '#333',
        justifyContent: 'space-between',
       zIndex: 10, // Ensure sidebar is above the content
    },
    menuIconContainer: {
        alignItems: 'flex-end',
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 10,
    },
    sidebarTitle: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    menuContainer: {
        flex: 1,
        marginTop: 20,
    },
    sidebarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 5,
        borderRadius: 8,
        backgroundColor: '#333',
        elevation: 2,
    },
    sidebarButtonText: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 10,
        fontWeight: '500',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#FF6347',
        borderRadius: 8,
        elevation: 5,
        marginBottom: 10,
    },
    logoutButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        marginLeft: 10,
    },
});

export default Sidebar;
