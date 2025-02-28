import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const MinimumWage = () => {
    const navigation = useNavigation();
    const [applicableWage, setApplicableWage] = useState('');
    const [dailyRate, setDailyRate] = useState('');
    const [restDays, setRestDays] = useState('');
    const [wageDifferential, setWageDifferential] = useState('');
    const [wholePeriod, setWholePeriod] = useState('');
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);
    const [totalWageDifferential, setTotalWageDifferential] = useState('');
    const [remarks, setRemarks] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    // Function to calculate whole period (P2 - P1) - RD
    const calculateWholePeriod = (from, to, restDaysPerWeek) => {
        const oneDay = 24 * 60 * 60 * 1000;
        const totalDays = Math.round((to - from) / oneDay) + 1; // (P2 - P1) + 1
        const fullWeeks = Math.floor(totalDays / 7);
        const remainingDays = totalDays % 7;

        // Corrected rest day calculation
        const extraRestDays = Math.floor(remainingDays / 7 * restDaysPerWeek); // Proportional extra rest days
        const totalRestDays = (fullWeeks * restDaysPerWeek) + extraRestDays;

        return totalDays - totalRestDays; // Whole period
    };

    const handleCalculate = () => {
        const minWage = parseFloat(applicableWage) || 0;
        const daily = parseFloat(dailyRate) || 0;
        const restDaysPerWeek = parseInt(restDays) || 0;
        
        // Calculate whole period
        const adjustedPeriod = calculateWholePeriod(fromDate, toDate, restDaysPerWeek);
        setWholePeriod(adjustedPeriod);

        // Calculate wage differential per day
        const differential = minWage - daily;
        setWageDifferential(differential.toFixed(2)); // Remove negative symbol

        // Check wage compliance
        if (daily >= minWage) {
            setRemarks("No Violation. Wage is above or equal to Minimum");
        } else {
            setRemarks("Violation. Underpayment of Minimum Wage");
        }

        // Total Wage Differential Calculation
        const totalDifferential = adjustedPeriod * differential;
        setTotalWageDifferential(totalDifferential.toFixed(2)); // Remove negative symbol

        setModalVisible(true);
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
            <Text style={styles.headerTitle}>MINIMUM WAGE</Text>
            </View>

            
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Applicable Minimum Wage:</Text>
                    <TextInput style={styles.input} value={applicableWage} onChangeText={setApplicableWage} keyboardType="numeric" />

                    <Text style={styles.label}>Actual Daily Rate:</Text>
                    <TextInput style={styles.input} value={dailyRate} onChangeText={setDailyRate} keyboardType="numeric" />

                    <Text style={styles.label}>Period:</Text>
                    <View style={styles.dateInputContainer}>
                        <TouchableOpacity style={styles.dateInput} onPress={() => setShowFromDatePicker(true)}>
                            <Text>{fromDate.toDateString()}</Text>
                        </TouchableOpacity>
                        <Text style={styles.toText}>to</Text>
                        <TouchableOpacity style={styles.dateInput} onPress={() => setShowToDatePicker(true)}>
                            <Text>{toDate.toDateString()}</Text>
                        </TouchableOpacity>
                    </View>

                    {showFromDatePicker && (
                        <DateTimePicker value={fromDate} mode="date" display="default" 
                            onChange={(event, selectedDate) => {
                                setShowFromDatePicker(false);
                                if (selectedDate) setFromDate(selectedDate);
                            }}
                        />
                    )}

                    {showToDatePicker && (
                        <DateTimePicker value={toDate} mode="date" display="default" 
                            onChange={(event, selectedDate) => {
                                setShowToDatePicker(false);
                                if (selectedDate) setToDate(selectedDate);
                            }}
                        />
                    )}

                    <Text style={styles.label}>Number of Rest Days per Week:</Text>
                    <TextInput style={styles.input} value={restDays} onChangeText={setRestDays} keyboardType="numeric" />

                    <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
                        <Text style={styles.calculateButtonText}>CALCULATE</Text>
                    </TouchableOpacity>
                </View>

                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Calculation Results</Text>

                            <View style={styles.resultContainer}>
                                <View style={styles.resultRow}>
                                    <Text style={styles.resultLabel}>Wage Differential per Day:</Text>
                                    <Text style={styles.resultValue}>₱{wageDifferential}</Text>
                                </View>

                                <View style={styles.resultRow}>
                                    <Text style={styles.resultLabel}>Total Wage Differential:</Text>
                                    <Text style={styles.resultValue}>₱{totalWageDifferential}</Text>
                                </View>


                                <View style={styles.resultRow}>
                                    <Text style={styles.resultLabel}>Whole Period:</Text>
                                    <Text style={styles.resultValue}>{wholePeriod} days</Text>
                                </View>

                                <View style={[styles.resultRow, styles.remarksRow]}>
                                    <Text style={styles.resultLabel}>Remarks:</Text>
                                </View>
                                <Text style={{ 
                                    fontSize: 16, 
                                    fontWeight: 'bold', 
                                    textAlign: 'center',  
                                    color: remarks.startsWith("No Violation") ? '#007F00' : '#FF4444' 
                                }}>
                                    {remarks}
                                </Text>
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

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    header: {
        flexDirection: 'row',  // Arrange items in a row
        alignItems: 'center',  // Align vertically in the center
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backIcon: {
        marginRight: 10, // Adds spacing between icon and title
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        flex: 1, // Takes up available space to center properly
    },
    
    
    content: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: 50,
    },
    formContainer: {
        top: '2%',
        width: '90%',
        height: '80%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        elevation: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#000',
    },
    dropdownContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 15,
    },
    dropdownText: {
        fontSize: 16,
        color: '#000',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        position: 'absolute',
        top: '30%',
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
    calculateButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
    },
    calculateButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 18,
    },
    dateInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    dateInput: {
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        width: '45%',
        alignItems: 'center',
    },

    toText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginHorizontal: 10, // Add spacing around "to"
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff', // White background
        padding: 25,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 15,
        color: 'black',
    },
    resultContainer: {
        width: '100%',
        backgroundColor: '#f8f8f8', // Light gray for contrast
        borderRadius: 12,
        padding: 15,
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    remarksRow: {
        borderBottomWidth: 0, // No border for last row
        justifyContent: 'flex-start',
    },
    resultLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#444',
    },
    resultValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    remarksText: {
        fontSize: 18,
        textAlign: 'center', // Ensures text fits properly
        paddingHorizontal: 10,
        paddingTop: 5,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#FFD700',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    
    
});

export default MinimumWage;