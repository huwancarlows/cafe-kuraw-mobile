import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    ScrollView,
    Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

const { height, width } = Dimensions.get('window');

const PremiumPay= () => {
    const navigation = useNavigation();
    const [specialDays, setSpecialDays] = useState('');
    const [dailyRate, setDailyRate] = useState('');
    const [totalPremiumPay, setTotalPremiumPay] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const calculatePremiumPay = () => {
        if (!specialDays.trim() && !dailyRate.trim()) {
            Alert.alert("Input Required", "Please fill out the required fields.");
            return;
        }
    
        if (!specialDays.trim()) {
            Alert.alert("Input Required", "Please enter the number of special day/rest day overtime.");
            return;
        }
    
        if (!dailyRate.trim()) {
            Alert.alert("Input Required", "Please enter the actual daily rate.");
            return;
        }
    
        const numSpecialDays = parseFloat(specialDays) || 0;
        const rate = parseFloat(dailyRate) || 0;
    
        // Use Math.round() to get the nearest whole number
        const premiumPay = Math.round(rate * 0.30 * numSpecialDays);
    
        setTotalPremiumPay(premiumPay);
        setModalVisible(true); // Show modal after calculation
    };
    

    const clearFields = () => {
        setSpecialDays('');
        setDailyRate('');
        setTotalPremiumPay(null);
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#2a2a2a', '#000']} style={styles.background} />
            <View style={styles.header}>
                <Ionicons 
                    name="arrow-back-outline" 
                    size={32} 
                    color="white" 
                    style={styles.backIcon} 
                    onPress={() => navigation.navigate('Home')} // Navigate back to HomePage 
                />
                <Text style={styles.headerTitle}>PREMIUM PAY</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Number of Special Day/Rest Day</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={specialDays}
                        onChangeText={setSpecialDays}
                        placeholder="Enter number of special day/rest day"
                        placeholderTextColor="#888"
                    />

                    <Text style={styles.label}>Actual Daily Rate</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={dailyRate}
                        onChangeText={setDailyRate}
                        placeholder="Enter daily rate"
                        placeholderTextColor="#888"
                    />

                    <TouchableOpacity style={styles.calculateButton} onPress={calculatePremiumPay}>
                        <Text style={styles.calculateButtonText}>CALCULATE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.clearButton} onPress={clearFields}>
                        <Text style={styles.clearButtonText}>CLEAR</Text>
                    </TouchableOpacity>

                    {/* {totalPremiumPay !== null && (
                        <View style={styles.resultContainer}>
                            <Text style={styles.resultLabel}>Total Premium Pay:</Text>
                            <Text style={styles.resultValue}>₱{totalPremiumPay}</Text>
                        </View>
                    )} */}
                </View>
            
                <Modal visible={modalVisible} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Calculation Results</Text>

                            <View style={styles.resultBox}>
                                <View style={styles.resultRow}>
                                    <Text style={styles.resultLabel}>Number of Special Day/Rest Day:</Text>
                                    <Text style={styles.resultHighlight}>{specialDays || '0'}</Text>
                                </View>

                                <View style={styles.resultRow}>
                                    <Text style={styles.resultLabel}>Actual Daily Rate:</Text>
                                    <Text style={styles.resultValue}>₱{dailyRate || '0'}</Text>
                                </View>


                                    <Text style={styles.resultLabel}></Text>
                                    <Text style={styles.resultLabel}>Total Premium Pay:</Text>
                                    <Text style={styles.resultValue}>₱{totalPremiumPay || '0.00'}</Text>
                            </View>

                            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButtonText}>CLOSE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>


            </ScrollView>
        </View>
    );
};

const scaleFont = (size) => size * PixelRatio.getFontScale();
const scaleSize = (size) => (size / 375) * width; // 375 is a common baseline width

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#000' 
    },
    background: { 
        ...StyleSheet.absoluteFillObject 
    },
    backIcon: {
        marginRight: 10, // Adds spacing between icon and title
        marginTop:20,
        color: '#FFD700',
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingTop: 60, 
        paddingHorizontal: 20, 
        paddingBottom: 20 
    },
         
    headerTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFD700',
        textAlign: 'center',
        flex: 1, // Ensures it takes up available space to center
        fontFamily: 'Helvetica Neue',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 5,
        marginRight:16,
        marginTop:20,
    },
    content: { 
        flexGrow: 1, 
        alignItems: 'center', 
        paddingBottom: 50 
    },
    formContainer: {
        top: '2%',
        width: '90%',
        height: '90%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        elevation: 5,
    },
    label: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        marginBottom: 5 
    },
    input: { 
        borderColor: '#000', 
        borderWidth: 1, 
        borderRadius: 8, 
        padding: 10, 
        marginBottom: 15, 
        fontSize: 16 
    },
    dateInput: { 
        borderColor: '#000', 
        borderWidth: 1, 
        borderRadius: 8, 
        padding: 10, 
        marginBottom: 15, 
        alignItems: 'center' 
    },
    calculateButton: {
        backgroundColor: '#FFD700',
        paddingVertical: scaleSize(15),
        borderRadius: scaleSize(8),
        alignItems: 'center',
        marginTop: scaleSize(10),
    },
    calculateButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: scaleFont(20),
    },
    clearButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: scaleSize(15),
        borderRadius: scaleSize(8),
        alignItems: 'center',
        marginTop: scaleSize(10),
    },
    clearButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: scaleFont(18),
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: scaleSize(15),
        width: '85%',
        paddingVertical: scaleSize(20),
        paddingHorizontal: scaleSize(25),
        alignItems: 'center',
        elevation: 10,
    },
    modalTitle: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        marginBottom: 15 
    },
    modalItem: {
        paddingVertical: scaleSize(10),
        paddingHorizontal: scaleSize(15),
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalItemText: {
        fontSize: scaleFont(16),
        color: '#000',
    },
    resultBox: {
        backgroundColor: '#f7f7f7',
        borderRadius: scaleSize(10),
        paddingVertical: scaleSize(15),
        paddingHorizontal: scaleSize(20),
        width: '100%',
        marginBottom: scaleSize(15),
        alignItems: 'center',  // Centering content
    },
    resultRow: {
        flexDirection: 'row',  // Forces horizontal alignment
        justifyContent: 'space-between',  // Pushes label left & value right
        alignItems: 'center',  // Align items vertically
        width: '100%',  
        paddingVertical: scaleSize(10),
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    
    resultLabel: {
        fontSize: scaleFont(16),
        color: '#444',
        textAlign: 'center',  // Center the label
        marginBottom: scaleSize(5),  // Add spacing below the label
    },

    resultValue: {
        fontSize: scaleFont(17),
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',  // Center the value
    },

    resultFinal: {
        fontSize: scaleFont(19),
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',  // Center the value
    },

    resultDOR: {
        fontSize: scaleFont(15),
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',  // Center the value
    },

    resultHighlight: {
        fontSize: scaleFont(18),
        fontWeight: 'bold',
        color: '#222',
    },
    closeButton: {
        marginTop: scaleSize(20),
        backgroundColor: '#FFD700',
        paddingVertical: scaleSize(12),
        paddingHorizontal: scaleSize(30),
        borderRadius: scaleSize(10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: scaleSize(20),
    },
    closeButtonText: {
        fontSize: scaleFont(18),
        fontWeight: 'bold',
        color: '#222',
    },
    buttonContainer: {
        flexDirection: 'row', 
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    
    toggleButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,  // Adds spacing between buttons
    },
    
    yellowButton: {
        backgroundColor: '#FFD700',  // Yellow background
    },
    
    toggleButtonText: {
        color: '#000',  // Black text
        fontSize: 16,
    },
    activeButton: {
        backgroundColor: "#FFD700", // Darker yellow shade for active effect
    },
    boldText: {
        fontWeight: "bold", // Make text bold when button is clicked
    },
    
});

export default PremiumPay;