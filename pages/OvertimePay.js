import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    Modal,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

const CustomCheckbox = ({ label, value, onValueChange }) => (
    <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => onValueChange(!value)}
    >
        <View style={[styles.checkbox, value && styles.checkboxChecked]}>
            {value && <Ionicons name="checkmark" size={18} color="#000" />}
        </View>
        <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
);

const OvertimePay = ({ navigation }) => {
    const [hoursOvertime, setHoursOvertime] = useState('');
    const [dailyRate, setdailyRate] = useState('');
    const [totalOvertimePay, setTotalOvertimePay] = useState('');
    
    const [restDay, setRestDay] = useState(false);
    const [holiday, setHoliday] = useState(false);
    const [nightShift, setNightShift] = useState(false);
    const [specialDay, setSpecialDay] = useState(false);
    const [doubleHoliday, setDoubleHoliday] = useState(false);
    const [doubleSpecial, setDoubleSpecial] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);


    const handleCalculate = () => {
        if (!hoursOvertime.trim() && !dailyRate.trim()) {
            Alert.alert("Input Required", "Please fill out the required fields.");
            return;
        }

        if (!hoursOvertime.trim()) {
        Alert.alert("Input Required", "Please enter the number of hours overtime.");
        return;
        }

        if (!dailyRate.trim()) {
        Alert.alert("Input Required", "Please enter the actual daily rate.");
        return;
        }

        const hours = parseFloat(hoursOvertime) || 0;
        const dailyRateValue = parseFloat(dailyRate) || 0;
    
        if (hours <= 0 || dailyRateValue <= 0) {
        Alert.alert("Invalid Input", "Hours and Daily Rate must be greater than zero.");
        return;
        }
    
        const hourlyRate = dailyRateValue / 8;
        let multiplier = 1.25;
        let formulaApplied = false; // Track if any formula was used
    
        // **Check for INVALID Checkbox Combinations**
            if (
                (restDay && holiday && nightShift && specialDay && doubleHoliday && doubleSpecial) || // All checked
                (holiday && doubleHoliday) || // Regular Holiday and Double Holiday
                (specialDay && doubleSpecial) || // Special Holiday and Double Special Holiday
                (holiday && doubleHoliday && restDay) || // Regular Holiday, Double Holiday, and Rest Day
                (holiday && doubleHoliday && restDay && nightShift) || // Regular Holiday, Double Holiday, Rest Day, and Night Shift
                (holiday && doubleHoliday && restDay && nightShift && specialDay) || // Regular Holiday, Double Holiday, Rest Day, Night Shift, and Special Holiday
                (specialDay && doubleSpecial && restDay && nightShift) // Special Holiday, Double Special Holiday, Rest Day, and Night Shift
            ) {
                setTotalOvertimePay("No Formula Calculated");
                Alert.alert("Invalid Combination", "The selected conditions do not have a valid formula.");
                return;
            }
    
        // Apply custom multipliers if any checkbox is checked
        if (doubleHoliday && restDay) {
            multiplier = 5.07;
            formulaApplied = true;
        } else if (doubleHoliday) {
            multiplier = 3.9;
            formulaApplied = true;
        } else if (holiday && restDay) {
            multiplier = 3.38;
            formulaApplied = true;
        } else if (holiday) {
            multiplier = 2.6;
            formulaApplied = true;
        } else if (doubleSpecial && restDay) {
            multiplier = 2.535;
            formulaApplied = true;
        } else if (specialDay && restDay) {
            multiplier = 1.95;
            formulaApplied = true;
        } else if (specialDay) {
            multiplier = 1.69;
            formulaApplied = true;
        } else if (restDay) {
            multiplier = 1.69;
            formulaApplied = true;
        }
    
        if (nightShift) {
            if (doubleHoliday && restDay) {
                multiplier = 5.577;
                formulaApplied = true;
            } else if (doubleHoliday) {
                multiplier = 4.29;
                formulaApplied = true;
            } else if (holiday && restDay) {
                multiplier = 3.718;
                formulaApplied = true;
            } else if (holiday) {
                multiplier = 2.86;
                formulaApplied = true;
            } else if (doubleSpecial && restDay) {
                multiplier = 2.7885;
                formulaApplied = true;
            } else if (specialDay && restDay) {
                multiplier = 2.145;
                formulaApplied = true;
            } else if (specialDay) {
                multiplier = 1.859;
                formulaApplied = true;
            } else if (restDay) {
                multiplier = 1.859;
                formulaApplied = true;
            } else {
                multiplier = 1.375;
                formulaApplied = true;
            }
        }

        // **Default Case: If No Checkboxes are Checked**
        if (
            !restDay &&
            !holiday &&
            !nightShift &&
            !specialDay &&
            !doubleHoliday &&
            !doubleSpecial
        ) {
            multiplier = 1.25;
            formulaApplied = true;
        }
    
        // **Final Check if No Valid Formula was Applied**
        if (!formulaApplied) {
            setTotalOvertimePay("No Formula Calculated");
            Alert.alert("No Formula Found", "The selected conditions do not have a valid formula.");
            return;
        }
    
        const overtimePay = hours * hourlyRate * multiplier;
        setTotalOvertimePay(`${overtimePay.toFixed(2)}`);

        setModalVisible(true);
    };


    const handleNumberInput = (text, setter) => {
        const filteredText = text.replace(/[^0-9.]/g, ''); // Allow only numbers and decimal points
        setter(filteredText);
    };

    const clearFields = () => {
        setHoursOvertime('');
        setdailyRate('');
        setTotalOvertimePay('');

        setRestDay(false);
        setHoliday(false);
        setNightShift(false);
        setSpecialDay(false);
        setDoubleHoliday(false);
        setDoubleSpecial(false);
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
                    onPress={() => navigation.navigate('Home')} // Navigate back to HomePage
                />
                <Text style={styles.headerTitle}>OVERTIME PAY</Text>
            </View>
            

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Number of Hours Overtime</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter number of hours overtime"
                        value={hoursOvertime}
                        onChangeText={(text) => handleNumberInput(text, setHoursOvertime)}
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Actual Daily Rate:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter actual daily rate"
                        value={dailyRate}
                        onChangeText={(text) => handleNumberInput(text, setdailyRate)}
                        keyboardType="numeric"
                    />

                    <View style={styles.checkboxContainer}>
                        <CustomCheckbox
                            label="Rest Day"
                            value={restDay}
                            onValueChange={setRestDay}
                        />
                        <CustomCheckbox
                            label="Regular Holiday"
                            value={holiday}
                            onValueChange={setHoliday}
                        />
                        <CustomCheckbox
                            label="Night Shift"
                            value={nightShift}
                            onValueChange={setNightShift}
                        />
                        <CustomCheckbox
                            label="Special Holiday"
                            value={specialDay}
                            onValueChange={setSpecialDay}
                        />
                        <CustomCheckbox
                            label="Double Holiday"
                            value={doubleHoliday}
                            onValueChange={setDoubleHoliday}
                        />
                        <CustomCheckbox
                            label="Double Special Holiday"
                            value={doubleSpecial}
                            onValueChange={setDoubleSpecial}
                        />
                    </View>

                    <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
                        <Text style={styles.calculateButtonText}>CALCULATE</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.clearButton} onPress={clearFields}>
                        <Text style={styles.clearButtonText}>CLEAR</Text>
                    </TouchableOpacity>
                    

                    <Modal visible={modalVisible} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Calculation Results</Text>
                
                    <View style={styles.resultBox}>
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Number of Hours Overtime:</Text>
                        <Text style={styles.resultValue}>{hoursOvertime || '0'}</Text>
                    </View>

                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Actual Daily Rate:</Text>
                        <Text style={styles.resultValue}>₱{dailyRate || '0'}</Text>
                    </View>

                    <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Pay Category:</Text>
                        <Text style={styles.payCategory} numberOfLines={2} ellipsizeMode="tail">
                            {[
                                restDay && 'Rest Day',
                                holiday && 'Holiday',
                                nightShift && 'Night Shift',
                                specialDay && 'Special Day',
                                doubleHoliday && 'Double Holiday',
                                doubleSpecial && 'Double Special Holiday'
                            ]
                                .filter(Boolean)
                                .join(', ') || 'Ordinary Day'}
                        </Text>
                    </View>
                
                    <View style={styles.resultRow}>
                        <Text style={styles.resultLabel}>Total Overtime Pay:</Text>
                        <Text style={styles.resultValue}>₱{totalOvertimePay || '0.00'}</Text>
                    </View>

                    <Text
                        style={[
                            styles.result,
                            totalOvertimePay.includes("No Formula") && { color: "red", fontWeight: "bold" },
                        ]}
                    >
                    </Text>
                    </View>
                
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeButtonText}>CLOSE</Text>
                    </TouchableOpacity>
                    </View>
                    </View>
                    </Modal>

                </View>
            </ScrollView>

        </View>
    );
};

const scaleFont = (size) => size * PixelRatio.getFontScale();
const scaleSize = (size) => (size / 375) * width; // 375 is a common baseline width

const { width, height } = Dimensions.get('window');

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
        paddingTop: height * 0.07, // 7% of screen height
        paddingHorizontal: width * 0.05, // 5% of screen width
        paddingBottom: height * 0.02, // 2% of screen height
    },
    backIcon: {
        marginRight: width * 0.02, // Dynamic spacing
    },
    headerTitle: {
        fontSize: width * 0.08, // Scaled font size
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: width * 0.11, 
        flex: 1,
    },
    content: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: height * 0.05,
    },
    formContainer: {
        top: height * 0.01,
        width: '90%',
        height: height * 0.80, // 85% of screen height
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: width * 0.05,
        elevation: 5,
    },
    label: {
        fontSize: width * 0.035, // Scales font size dynamically
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
    },
    input: {
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: height * 0.015, // Adjusted for better touch targets
        paddingHorizontal: width * 0.04,
        marginBottom: height * 0.02,
        fontSize: width * 0.04,
        color: '#000',
        backgroundColor: '#fff',
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: height * 0.015,
    },
    checkbox: {
        width: width * 0.06, // Scaled checkbox size
        height: width * 0.06,
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: width * 0.02,
        backgroundColor: '#fff',
    },
    checkboxChecked: {
        backgroundColor: '#FFD700',
        borderColor: '#FFD700',
    },
    calculateButton: {
        backgroundColor: '#FFD700',
        paddingVertical: height * 0.02,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: height * 0.015,
    },
    calculateButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: width * 0.05,
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
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        padding: width * 0.06,
        borderRadius: 15,
        alignItems: 'center',
        elevation: 10,
    },
    modalTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        marginBottom: height * 0.015,
        color: '#000',
    },
    resultContainer: {
        marginTop: height * 0.03,
        alignItems: 'center',
    },
    resultBox: {
        backgroundColor: '#f7f7f7',
        borderRadius: 10,
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.05,
        width: '100%',
    },
    resultRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: height * 0.01,
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
    payCategory: {
        fontSize: 16,
        textAlign: 'right', // Aligns text to the right
        flex: 1, // Allows it to take available space
        flexWrap: 'wrap', // Ensures it wraps if needed
        fontWeight: 'bold',
    },

    closeButton: {
        marginTop: height * 0.03,
        backgroundColor: '#FFD700',
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.08,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButtonText: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#222',
    },
    clearButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: height * 0.02,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: height * 0.015,
    },
    clearButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: width * 0.045,
    },
});


export default OvertimePay;