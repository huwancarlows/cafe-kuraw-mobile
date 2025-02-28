import React, { useState, useEffect } from 'react'; 
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Modal,
    FlatList,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


const computationOptions = [
    { label: 'Select type of computation...', value: '' },
    { label: 'Minimum Wage', value: 'minimum_wage' },
    { label: 'Overtime Pay', value: 'overtime_pay' },
    { label: 'Holiday Pay', value: 'holiday_pay' },
    { label: 'Premium Pay', value: 'premium_pay' },
    { label: 'Night Shift Differential', value: 'nightshift' },
    { label: 'Service Charges', value: 'service_charges' },
    { label: 'Service Incentive Leave', value: 'service_incentive' },
    { label: 'Maternity Leave', value: 'maternity_leave' },
    { label: 'Paternity Leave', value: 'paternity_leave' },
    { label: 'Parental Leave', value: 'parental_leave' },
    { label: 'Leave for VAWC', value: 'vawc' },
    { label: 'Special Leave for Women', value: 'special_leave_women' },
    { label: '13th Month Pay', value: '13th_month' },
    { label: 'Separation Pay', value: 'separation_pay' },
    { label: 'Retirement Pay', value: 'retirement_pay' },
    { label: 'ECC Benefits', value: 'ecc_benefits' },
    { label: 'PhilHealth Benefits', value: 'philhealth' },
    { label: 'SSS Benefits', value: 'sss' },
    { label: 'Pag-IBIG Benefits', value: 'pagibig' },
];

const HomePage = ({ navigation }) => {
    const [selectedComputation, setSelectedComputation] = useState('');
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        checkAuthenticationStatus();
    }, []);

    const checkAuthenticationStatus = async () => {
        console.log("Checking authentication status using AsyncStorage...");
        try {
            const storedProfile = await AsyncStorage.getItem('loggedInUser');
            console.log('Stored Profile from AsyncStorage:', storedProfile);

            if (storedProfile) {
                setIsLoggedIn(true);
                console.log('User is logged in.');
            } else {
                setIsLoggedIn(false);
                console.log('User is not logged in.');
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            setIsLoggedIn(false);
        }
    };

    const handleProfileIconPress = async () => {
        console.log("Profile icon clicked!");
        await checkAuthenticationStatus();

        if (isLoggedIn) {
            console.log("User is logged in. Navigating to Admin...");
            navigation.navigate('Admin');
        } else {
            console.log("User not logged in. Navigating to Login...");
            navigation.navigate('Login');
        }
    };


    const handleSelectComputation = (value) => {
        setSelectedComputation(value);
        setDropdownVisible(false);
    };

    const handleGoPress = () => {
        if (!selectedComputation || selectedComputation === '') {
            Alert.alert('Please select a type of computation.');
            return;
        }

        navigation.navigate(selectedComputation.charAt(0).toUpperCase() + selectedComputation.slice(1));


        if (selectedComputation === 'minimum_wage') {
            navigation.navigate('MinimumWage');
        } else if (selectedComputation === 'overtime_pay') {
            navigation.navigate('OvertimePay');
        } else if (selectedComputation === 'holiday_pay') {
            navigation.navigate('HolidayPay');
        } else {
            Alert.alert('Navigation not set for this computation type.');
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

<View style={styles.header}>
                <Ionicons 
                    name="arrow-back-outline" 
                    size={32} 
                    color="white" 
                    style={styles.backIcon} 
                    onPress={() => navigation.navigate('Landing')}
                />
                <Ionicons 
                    name="person-circle-outline" 
                    size={32} 
                    color="white" 
                    style={styles.profileIcon} 
                    onPress={handleProfileIconPress} 
                />
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>LABOR STANDARDS</Text>
                <Text style={styles.subtitle}>COMPUTATION</Text>

                <TouchableOpacity
                    style={styles.dropdownContainer}
                    onPress={() => setDropdownVisible(true)}
                >
                    <Text style={styles.dropdownText}>
                        {selectedComputation
                            ? computationOptions.find(opt => opt.value === selectedComputation)?.label
                            : 'Select type of computation...'}
                    </Text>
                    <Ionicons name="chevron-down" size={24} color="#000" />
                </TouchableOpacity>

                <Modal
                    visible={isDropdownVisible}
                    transparent={true}
                    animationType="fade"
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        onPress={() => setDropdownVisible(false)}
                    />
                    <View style={styles.modalContainer}>
                        <FlatList
                            data={computationOptions}
                            keyExtractor={(item) => item.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => handleSelectComputation(item.value)}
                                >
                                    <Text style={styles.modalItemText}>{item.label}</Text>
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={true}
                        />
                    </View>
                </Modal>

                <TouchableOpacity style={styles.goButton} onPress={handleGoPress}>
                    <Text style={styles.goButtonText}>GO</Text>
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
    header: {
        flexDirection: 'row', 
        justifyContent: 'space-between', // Aligns icons on opposite ends
        alignItems: 'center', // Ensures both icons are vertically aligned
        paddingHorizontal: 16, // Adjust spacing from screen edges
        paddingVertical: 10, // Adjust vertical padding
        marginTop: 25,
    },
    backIcon: {
        marginLeft: 0, // No need for marginRight
    },
    profileIcon: {
        marginRight: 0, // No need for marginLeft
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        paddingHorizontal: 20,
        marginBottom: 100,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtitle: {
        fontSize: 20,
        color: '#B0B0B0',
        marginBottom: 40,
    },
    dropdownContainer: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginBottom: 20,
        elevation: 3,
    },
    dropdownText: {
        color: '#000',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        position: 'absolute',
        top: '50%',
        left: '10%',
        right: '10%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        elevation: 5,
        maxHeight: '40%',
    },
    modalItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalItemText: {
        fontSize: 16,
        color: '#000',
    },
    goButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 8,
        marginTop: 30,
    },
    goButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 20,
    },
});

export default HomePage;