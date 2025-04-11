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
        let formulaApplied = false;
    
        // Invalid combinations
        if (
            (restDay && holiday && nightShift && specialDay && doubleHoliday && doubleSpecial) || // All checked
            (holiday && doubleHoliday) || // Regular Holiday and Double Holiday
            (specialDay && doubleSpecial) || // Special Holiday and Double Special Holiday
            (holiday && doubleHoliday && restDay) || // Regular Holiday, Double Holiday, and Rest Day
            (holiday && doubleHoliday && restDay && nightShift) || // Regular Holiday, Double Holiday, Rest Day, and Night Shift
            (holiday && doubleHoliday && restDay && nightShift && specialDay) || // ...and Special Holiday
            (specialDay && doubleSpecial && restDay && nightShift) // Special Holiday, Double Special Holiday, Rest Day, and Night Shift
        ) {
            setTotalOvertimePay("No Formula Calculated");
            Alert.alert("Invalid Combination", "The selected conditions do not have a valid formula.");
            return;
        }
        
    
        // Specific multipliers by combinations
        if (doubleHoliday && restDay && nightShift) {
            multiplier = 5.577;
        } else if (doubleHoliday && nightShift) {
            multiplier = 4.29;
        } else if (holiday && restDay && nightShift) {
            multiplier = 3.718;
        } else if (holiday && nightShift) {
            multiplier = 2.86;
        } else if (doubleSpecial && nightShift) {
            multiplier = 2.145;
        } else if (specialDay && restDay && nightShift) {
            multiplier = 2.145;
        } else if (specialDay && nightShift) {
            multiplier = 1.859;
        } else if (restDay && nightShift) {
            multiplier = 1.859;
        } else if (nightShift) {
            multiplier = 1.375;
        } else if (doubleHoliday && restDay) {
            multiplier = 5.07;
        } else if (doubleHoliday) {
            multiplier = 3.9;
        } else if (holiday && restDay) {
            multiplier = 3.38;
        } else if (holiday) {
            multiplier = 2.6;
        } else if (doubleSpecial && restDay) {
            multiplier = 2.535;
        } else if (doubleSpecial) {
            multiplier = 1.95;
        } else if (specialDay && restDay) {
            multiplier = 1.95;
        } else if (specialDay) {
            multiplier = 1.69;
        } else if (restDay) {
            multiplier = 1.69;
        } else {
            multiplier = 1.25; // Ordinary day
        }
    
        formulaApplied = true;
    
        const overtimePay = hours * hourlyRate * multiplier;
        setTotalOvertimePay(`${Math.round(overtimePay)}`);
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
                    

                    <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
                        <Text style={styles.calculateButtonText}>CALCULATE</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.clearButton} onPress={clearFields}>
                        <Text style={styles.clearButtonText}>CLEAR</Text>
                    </TouchableOpacity>
                    </View>
                    

                    <Modal visible={modalVisible} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Calculation Results</Text>
                
                    <View style={styles.resultBox}>
                        <View style={styles.resultRow}>
                            <Text style={styles.resultLabel}>Number of Hours Overtime:</Text>
                            <Text style={styles.resultValue}>{hoursOvertime || '0'} hours</Text>
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
                                    holiday && 'Regular Holiday',
                                    nightShift && 'Night Shift',
                                    specialDay && 'Special Holiday',
                                    doubleHoliday && 'Double Holiday',
                                    doubleSpecial && 'Double Special Holiday'
                                ]
                                    .filter(Boolean)
                                    .join(', ') || 'Ordinary Day'}
                            </Text>
                        </View>
                
                        <Text style={styles.resultLabel}></Text>
                        <Text style={styles.resultLabel}>Total Overtime Pay:</Text>
                        <Text style={styles.resultValue}>₱{totalOvertimePay || '0.00'}</Text>
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
        backgroundColor: '#000' 
    },
    background: { 
        ...StyleSheet.absoluteFillObject 
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
        fontWeight: 'bold', 
        color: '#fff', 
        marginLeft: 70,
        flex: 1,
    },
    content: { 
        flexGrow: 1, 
        alignItems: 'center', 
        paddingBottom: 50 
    },
    formContainer: { 
        width: '90%', 
        backgroundColor: '#fff', 
        borderRadius: 20, 
        padding: 20, 
        elevation: 5 
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

    payCategory: {
        fontSize: scaleFont(15),
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',
        flex: 1, // Use flex to fill space instead of fixed width
        marginLeft: scaleSize(10), // Space between label and value
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
    
});


export default OvertimePay;