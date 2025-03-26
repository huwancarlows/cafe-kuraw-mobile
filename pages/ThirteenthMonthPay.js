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
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

const ThirteenthMonthPay = () => {
    const navigation = useNavigation();
    const [dailyRate, setDailyRate] = useState('');
    const [restDays, setRestDays] = useState('');
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);
    const [calculatedThirteenthMonthPay, setCalculatedThirteenthMonthPay] = useState(''); // Store calculated 13th month pay
    const [numOfMonths, setNumOfMonths] = useState('');
    const [selectedOption, setSelectedOption] = useState(null);
   


    const [modalVisible, setModalVisible] = useState(false);

    const handleCalculate = () => {
        const daily = parseFloat(dailyRate) || 0;  
        const restDaysPerWeek = parseInt(restDays) || 0;  
        const monthsWorked = parseInt(numOfMonths) || 12; 
    
        if (selectedOption === 'period') {
            if (!fromDate || !toDate) {
                Alert.alert("Invalid input", "Please select both Start Date (P1) and End Date (P2).");
                return;
            }
    
            const from = new Date(fromDate);
            const to = new Date(toDate);
    
            if (from.toDateString() === to.toDateString()) {
                Alert.alert("Invalid period", "Start Date (P1) and End Date (P2) cannot be the same.");
                return;
            }
    
            if (from > to) {
                Alert.alert("Invalid period", "Start Date (P1) cannot be later than End Date (P2).");
                return;
            }


           
         // ✅ Calculate total period (P2 - P1)
        const totalDays = Math.floor((to - from) / (1000 * 60 * 60 * 24)) + 1;

        if (totalDays < 30) {
            Alert.alert("Invalid Calculation", "Must be atleast 1 Month to qualify for 13th Month Pay.");
                            return;
        }
       
        // ✅ Compute total rest days
        const totalRestDays = (restDaysPerWeek * 4) * (totalDays / 30);

        // ✅ Compute total working days
        const workingDays = totalDays - totalRestDays;

      // ✅ Apply the given formula for 13th-month pay (Period mode)
      const calculatedThirteenthMonthPay = ((workingDays * daily) * (1 / 12));

    // Store the result in state
    setCalculatedThirteenthMonthPay(calculatedThirteenthMonthPay.toFixed(2));



// Show modal with results
setModalVisible(true);

        } else if (selectedOption === 'manual') {
            // ✅ Apply the given formula for 13th-month pay (Manual mode)
            const calculatedThirteenthMonthPay = (monthsWorked * 26 * daily)* (1 / 12);
    
            // Store the result
            setCalculatedThirteenthMonthPay(calculatedThirteenthMonthPay.toFixed(2));
        }
    
        // ✅ Show modal with results
        setModalVisible(true);
    };
    
    const clearFields = () => {
        setRestDays('');
        setDailyRate('');
        setNumOfMonths(null);
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
            <Text style={styles.headerTitle}>13th Month Pay</Text>
            </View>

            
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Actual Daily Rate:</Text>
                    <TextInput style={styles.input} value={dailyRate} onChangeText={setDailyRate} keyboardType="numeric" />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity 
                                style={styles.periodButton} 
                                onPress={() => setSelectedOption('period')} // Set selected option
                            >
                                <Text style={styles.periodButtonText}>PERIOD</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.manualButton} 
                                onPress={() => setSelectedOption('manual')} // Set selected option
                            >
                                <Text style={styles.manualButtonText}>MANUAL</Text>
                            </TouchableOpacity>
                        </View>

                       {/* Show Period Date Pickers when PERIOD button is clicked */}
                        {selectedOption === 'period' && (
                            <View>
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

                        {/* Show Number of Rest Days per Week */}
                                    <View>
                                        <Text style={styles.label}>Number of Rest Days per Week:</Text>
                                        <TextInput 
                                            style={styles.input} 
                                            value={restDays} 
                                            onChangeText={setRestDays} 
                                            keyboardType="numeric"/>
                                    </View>
                            </View>
                        )}

                        {/* Show No. of Months input when MANUAL button is clicked */}
                        {selectedOption === 'manual' && (
                            <View>
                                <Text style={styles.label}>No. of Months:</Text>
                                <TextInput 
                                    style={styles.input} 
                                    value={numOfMonths} 
                                    onChangeText={setNumOfMonths} 
                                    keyboardType="numeric" 
                                />
                            </View>
                        )}

                        {/* Date Pickers */}
                        {showFromDatePicker && (
                            <DateTimePicker 
                                value={fromDate} 
                                mode="date" 
                                display="default" 
                                onChange={(event, selectedDate) => {
                                    setShowFromDatePicker(false);
                                    if (selectedDate) setFromDate(selectedDate);
                                }}
                            />
                        )}

                        {showToDatePicker && (
                            <DateTimePicker 
                                value={toDate} 
                                mode="date" 
                                display="default" 
                                onChange={(event, selectedDate) => {
                                    setShowToDatePicker(false);
                                    if (selectedDate) setToDate(selectedDate);
                                }}
                            />
                        )}

                    <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
                        <Text style={styles.calculateButtonText}>CALCULATE</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.clearButton} onPress={clearFields}>
                        <Text style={styles.clearButtonText}>CLEAR</Text>
                    </TouchableOpacity>
                </View>
                <Modal visible={modalVisible} transparent animationType="slide">
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Calculation Results</Text>

                                <View style={styles.resultContainer}>
                                    <View style={styles.resultRow}>
                                        <Text style={styles.resultLabel}>Actual Daily Rate:</Text>
                                        <Text style={styles.resultValue}>₱{dailyRate}</Text>
                                    </View>

                                {/* ✅ Show "Period" and "Number of Rest Days Per Week" only if Period button is clicked */}
                                {selectedOption === 'period' && (
                                <>
                                <View style={styles.resultRow}>
                                    <Text style={styles.resultLabel}>Period:</Text>
                                    <Text style={styles.resultValue}>
                                    {fromDate ? fromDate.toLocaleDateString() : "N/A"} - {toDate ? toDate.toLocaleDateString() : "N/A"}
                                    </Text>
                                </View>
                                <View style={styles.resultRow}>
                                    {/* Display Number of Rest Days Per Week */}
                                    <Text style={styles.resultLabel}>Number of Rest Days Per Week:</Text>
                                    <Text style={styles.resultValue}>{restDays} day/s</Text>
                                </View>
                                </>
                                )}
                                
                                    {/* ✅ Show "Number of Months" only if Manual button is clicked */}
                                    {selectedOption === 'manual' && (
                                        <View style={styles.resultRow}>
                                            <Text style={styles.resultLabel}>Number of Months:</Text>
                                            <Text style={styles.resultValue}>{numOfMonths} month/s</Text>
                                        </View>
                                    )}

                                    <View style={styles.resultRow}>
                                        <Text style={styles.resultLabel}>Total 13th Month Pay:</Text>
                                        <Text style={styles.resultValue}>₱{calculatedThirteenthMonthPay}</Text>
                                    </View>
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
        marginTop: 10,
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

    clearButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    clearButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },

    buttonContainer: {
        flexDirection: 'row', 
        justifyContent: 'center', // Center buttons
        alignItems: 'center', 
        gap: 8, // Reduce the space between buttons
        marginTop: -4,
        marginBottom:10,
    },
    periodButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 4,
        width: 100, 
    },
    periodButtonText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 18,
    },

    manualButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 4,
        width: 100, 
    },
    manualButtonText: {
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 18,
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

export default ThirteenthMonthPay;