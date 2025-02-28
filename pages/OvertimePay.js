import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
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

const CustomRadioButton = ({ label, selected, onPress, disabled }) => (
    <TouchableOpacity
        style={[styles.radioRow, disabled && styles.disabled]}
        onPress={!disabled ? onPress : null}
    >
        <View style={[styles.radioButton, selected && styles.radioButtonSelected]}>
            {selected && <View style={styles.radioInner} />}
        </View>
        <Text style={[styles.radioLabel, disabled && styles.disabledText]}>{label}</Text>
    </TouchableOpacity>
);

const OvertimePay = ({ navigation }) => {
    const [hoursOvertime, setHoursOvertime] = useState('');
    const [dailyRate, setdailyRate] = useState('');
    const [worked, setWorked] = useState('');
    const [totalOvertimePay, setTotalOvertimePay] = useState('');
    
    const [restDay, setRestDay] = useState(false);
    const [holiday, setHoliday] = useState(false);
    const [nightShift, setNightShift] = useState(false);
    const [specialDay, setSpecialDay] = useState(false);
    const [doubleHoliday, setDoubleHoliday] = useState(false);
    const [doubleSpecial, setDoubleSpecial] = useState(false);

    const handleCalculate = () => {
        const hours = parseFloat(hoursOvertime) || 0;
        const dailyRateValue = parseFloat(dailyRate) || 0;
    
        if (hours <= 0 || dailyRateValue <= 0) {
            setTotalOvertimePay("0.00");
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
            (specialDay && doubleSpecial && restDay) || // Special Holiday, Double Special Holiday, and Rest Day
            (specialDay && doubleSpecial && restDay && nightShift) || // Special Holiday, Double Special Holiday, Rest Day, and Night Shift
            (doubleSpecial) // Double Special Holiday (alone)
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
        setTotalOvertimePay(`PHP ${overtimePay.toFixed(2)}`);
    };
    
    
    

    const handleNumberInput = (text, setter) => {
        const filteredText = text.replace(/[^0-9.]/g, ''); // Allow only numbers and decimal points
        setter(filteredText);
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
                        placeholder=""
                        value={hoursOvertime}
                        onChangeText={(text) => handleNumberInput(text, setHoursOvertime)}
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Actual Daily Rate:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder=""
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


                    <View style={styles.radioContainer}>
                        <CustomRadioButton label=" Worked" selected={worked} onPress={() => setWorked(true)} />
                        <CustomRadioButton label=" Unworked" selected={!worked} onPress={() => setWorked(false)} />
                    </View>

                    <Text style={styles.label}>Total Overtime Pay:</Text>
                    <Text
                        style={[
                            styles.result,
                            totalOvertimePay.includes("No Formula") && { color: "red", fontWeight: "bold" },
                        ]}
                    >
                        {totalOvertimePay.includes("No Formula") ? "No Formula Calculated" : ` ${totalOvertimePay}`}
                    </Text>

                    <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
                        <Text style={styles.calculateButtonText}>CALCULATE</Text>
                    </TouchableOpacity>
                </View>
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
        top: '5%',
        width: '90%',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        elevation: 5,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5,
    },
    input: {
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
    },
    checkboxContainer: {
        marginBottom: 20,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        backgroundColor: '#fff',
    },
    checkboxChecked: {
        backgroundColor: '#FFD700',
        borderColor: '#FFD700',
    },
    checkboxLabel: {
        fontSize: 16,
        color: '#000',
    },
    radioContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        marginBottom: 20 
    },
    radioRow: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    radioButton: { 
        width: 24, 
        height: 24, 
        borderRadius: 12, 
        borderWidth: 2, 
        borderColor: '#000', 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    radioButtonSelected: { 
        backgroundColor: '#FFD700', 
        borderColor: '#FFD700' 
    },
    radioInner: { 
        width: 12, 
        height: 12, 
        borderRadius: 6, 
        backgroundColor: '#000' 
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
        fontSize: 20,
    },
    result: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        paddingVertical: 10,
        textAlign: 'center',
    },
});

export default OvertimePay;