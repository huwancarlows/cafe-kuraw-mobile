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
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

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

        // Validation: Check if fields are empty
        if (!applicableWage.trim() &&  !dailyRate.trim() &&  !restDays.trim()) {
            Alert.alert("Input Required", "Please fill in all required fields before calculating.");
            return;
        }

        if (!applicableWage.trim()) {
            Alert.alert("Input Required", "Please enter the applicable minimum wage.");
            return;
        }

        if (!dailyRate.trim()) {
            Alert.alert("Input Required", "Please enter the actual daily rate.");
            return;
        }

        if (!restDays.trim()) {
            Alert.alert("Input Required", "Please enter the number of rest days per week.");
            return;
        }

        const minWage = parseFloat(applicableWage) || 0;
        const daily = parseFloat(dailyRate) || 0;
        const restDaysPerWeek = parseInt(restDays) || 0;

        // Calculate whole period
        const adjustedPeriod = calculateWholePeriod(fromDate, toDate, restDaysPerWeek);
        setWholePeriod(adjustedPeriod);

        // Validation: Ensure the date range is valid
        if (fromDate >= toDate) {
            Alert.alert("Input Required", "The From date must be EARLIER than the To date.");
            return;
        }

        // Calculate wage differential per day
        const differential = minWage - daily;
        setWageDifferential(Math.abs(differential).toFixed(2)); // Remove negative symbol

        // Check wage compliance
        if (daily >= minWage) {
            setRemarks("NO VIOLATION. \nWAGE IS ABOVE OR EQUAL TO MINIMUM")
        } else {
            setRemarks("VIOLATION.\nUNDERPAYMENT OF MINIMUM WAGE");
        }

        // Total Wage Differential Calculation
        const totalDifferential = adjustedPeriod * differential;
        setTotalWageDifferential(Math.abs(totalDifferential).toFixed(2)); // Remove negative symbol

        setModalVisible(true);
    
    };

    const clearFields = () => {
        setApplicableWage('');
        setDailyRate('');
        setRestDays('');
        setWageDifferential('');
        setWholePeriod('');
        setShowFromDatePicker(false);
        setShowToDatePicker(false);
    
        // Reset to default date (or current date)
        setFromDate(new Date());
        setToDate(new Date());
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
                    <TextInput 
                        style={styles.input} 
                        value={applicableWage} 
                        onChangeText={setApplicableWage} 
                        keyboardType="numeric"
                        placeholder="Enter minimum wage"
                    />

                    <Text style={styles.label}>Actual Daily Rate:</Text>
                    <TextInput 
                        style={styles.input} 
                        value={dailyRate} 
                        onChangeText={setDailyRate} 
                        keyboardType="numeric"
                        placeholder="Enter actual daily rate"
                    />

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
                    <TextInput 
                        style={styles.input} 
                        value={restDays} 
                        onChangeText={setRestDays} 
                        keyboardType="numeric" 
                        placeholder="Enter number of days per week"
                    />

                    <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
                        <Text style={styles.calculateButtonText}>CALCULATE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.clearButton} onPress={clearFields}>
                        <Text style={styles.clearButtonText}>CLEAR</Text>
                    </TouchableOpacity>
                </View>

                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Calculation Results</Text>

                            <View style={styles.resultContainer}>
                                <View style={styles.resultRow}>
                                    <Text style={styles.resultLabel}>Total Wage Differential:</Text>
                                    <Text style={styles.resultValue}>₱{totalWageDifferential}</Text>
                                </View>

                                <View style={styles.resultRow}>
                                    <Text style={styles.resultLabel}>Wage Differential per Day:</Text>
                                    <Text style={styles.resultValue}>₱{wageDifferential}</Text>
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
                                    color: remarks.startsWith("NO VIOLATION") ? '#007F00' : '#FF4444' 
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



// Get device screen width and height
const { width, height } = Dimensions.get('window');

const scaleFont = (size) => size * PixelRatio.getFontScale();
const scaleSize = (size) => (size / 375) * width; // 375 is a common baseline width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: height * 0.08,  // Adjusts for notch screens
        paddingHorizontal: width * 0.05,
        paddingBottom: height * 0.02,
    },
    backIcon: {
        marginRight: width * 0.03, 
    },
    headerTitle: {
        fontSize: scaleFont(28),
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: width * 0.14,
        flex: 1,
    },
    content: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: height * 0.05,
    },
    formContainer: {
        top: '2%',
        width: '90%',
        height: '95%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: width * 0.05,
        elevation: 5,
    },
    label: {
        fontSize: scaleFont(15),
        fontWeight: 'bold',
        color: '#000',
        marginBottom: height * 0.005,
    },
    input: {
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.04,
        marginBottom: height * 0.02,
        fontSize: scaleFont(15),
        color: '#000',
        width: '100%',
        minHeight: height * 0.06, // Ensures uniform height
    },
    dropdownContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.015,
        marginBottom: height * 0.02,
    },
    dropdownText: {
        fontSize: scaleFont(16),
        color: '#000',
    },
    modalItem: {
        paddingVertical: height * 0.012,
        paddingHorizontal: width * 0.04,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalItemText: {
        fontSize: scaleFont(16),
        color: '#000',
    },
    calculateButton: {
        backgroundColor: '#FFD700',
        paddingVertical: height * 0.02,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: height * 0.03,
        width: '100%',
    },
    calculateButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: scaleFont(18),
    },
    clearButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: height * 0.02,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: height * 0.015,
        width: '100%',
    },
    clearButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: scaleFont(18),
    },
    dateInputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
    dateInput: {
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.04,
        width: '45%',
        alignItems: 'center',
    },
    toText: {
        fontSize: scaleFont(16),
        fontWeight: 'bold',
        color: '#000',
        marginHorizontal: width * 0.03,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: height * 0.012,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    remarksRow: {
        borderBottomWidth: 0,
        justifyContent: 'flex-start',
    },
    resultLabel: {
        fontSize: scaleFont(16),
        fontWeight: '500',
        color: '#444',
    },
    resultValue: {
        fontSize: scaleFont(18),
        fontWeight: 'bold',
        color: '#333',
    },
    remarksText: {
        fontSize: scaleFont(18),
        textAlign: 'center',
        paddingHorizontal: width * 0.03,
        paddingTop: height * 0.008,
    },
    closeButton: {
        marginTop: height * 0.02,
        backgroundColor: '#FFD700',
        paddingVertical: height * 0.018,
        paddingHorizontal: width * 0.08,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButtonText: {
        fontSize: scaleFont(18),
        fontWeight: 'bold',
        color: '#222',
    },
});


export default MinimumWage;
