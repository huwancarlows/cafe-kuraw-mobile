import React, { useState, useEffect } from 'react';
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
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';  
import DateTimePicker from '@react-native-community/datetimepicker';
import { differenceInCalendarYears } from 'date-fns';
import { differenceInDays } from 'date-fns';


const { width } = Dimensions.get('window');

const RetirementPay = () => {
    const navigation = useNavigation();
    const [dateHired, setDateHired] = useState(new Date());
    const [useManualYears, setUseManualYears] = useState(false);
    const [manualYears, setManualYears] = useState('');
    const [dailyRate, setDailyRate] = useState('');
    const [dateRetirement, setDateRetirement] = useState(new Date());
    const [age, setAge] = useState('');
    const [retirementPay, setRetirementPay] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [showDateHiredPicker, setShowDateHiredPicker] = useState(false);
    const [showDateRetirementPicker, setShowDateRetirementPicker] = useState(false);
    const [activeButton, setActiveButton] = useState(null);

    useEffect(() => {
        if (useManualYears) {
            if (manualYears && !isNaN(parseInt(manualYears))) {
                return;
            }
        } else {
            const calculatedYearsWorked = new Date().getFullYear() - dateHired.getFullYear();
            setManualYears(calculatedYearsWorked.toString());

            const newRetirementDate = new Date(dateHired);
            newRetirementDate.setFullYear(dateHired.getFullYear() + calculatedYearsWorked);
            setDateRetirement(newRetirementDate);
        }
    }, [dateHired, manualYears, useManualYears]);

    const [finalDateHired, setFinalDateHired] = useState("");

    const calculateRetirementPay = () => {
        const numericAge = parseInt(age);
        const rate = Math.round(parseFloat(dailyRate)); // Ensure whole number
    
        if (isNaN(numericAge) || numericAge <= 0) {
            Alert.alert("Invalid Input", "Please enter a valid Age.");
            return;
        }
        if (isNaN(rate) || rate <= 0) {
            Alert.alert("Invalid Input", "Please enter a valid Daily Rate greater than 0.");
            return;
        }
        if (numericAge < 60) {
            Alert.alert("No Retirement Pay", "The employee is not eligible for retirement pay.");
            setRetirementPay("₱0");
            return;
        }
    
        let yearsWorked = 0;
        let calculatedDateHired;
        let formattedDateHired;
    
        if (useManualYears) {
            yearsWorked = parseInt(manualYears);
            if (isNaN(yearsWorked) || yearsWorked <= 0) {
                Alert.alert("Invalid Input", "Please enter a valid number of years worked.");
                return;
            }
    
            // Check if years worked is less than 5
            if (yearsWorked < 5) {
                Alert.alert("Not Eligible for Retirement Pay", "Employee hasn't worked 5 years, so no retirement pay.");
                setRetirementPay("₱0");
                return;
            }
    
            // Calculate Date Hired based on the number of years worked manually
            calculatedDateHired = new Date(dateRetirement);
            calculatedDateHired.setFullYear(calculatedDateHired.getFullYear() - yearsWorked);
            formattedDateHired = `${yearsWorked} Years`;
        } else {
            // Check if Date Hired is less than 5 years ago
            const currentYear = new Date().getFullYear();
            const hiredYear = dateHired.getFullYear();
            const yearsSinceHired = currentYear - hiredYear;
    
            if (yearsSinceHired < 5) {
                Alert.alert("Not Eligible for Retirement Pay", "Employee hasn't worked 5 years, so no retirement pay.");
                setRetirementPay("₱0");
                return;
            }
    
            calculatedDateHired = dateHired;
            const daysWorked = differenceInDays(dateRetirement, calculatedDateHired);
            formattedDateHired = calculatedDateHired.toDateString();
    
            // New formula for retirement pay (rounded to a whole number)
            const calculatedPay = Math.round(daysWorked * (1 / 365) * 1000 * 22.5);
            setRetirementPay(`₱${calculatedPay.toLocaleString()}`);
            setModalVisible(true);
            setFinalDateHired(formattedDateHired);
            return;
        }
    
        setFinalDateHired(formattedDateHired);
    
        if (dateRetirement <= calculatedDateHired) {
            Alert.alert("Invalid Dates", "Date of Retirement must be after Date Hired.");
            return;
        }
    
        // Ensure whole number calculation for retirement pay
        const calculatedPay = Math.round(rate * 22.5 * yearsWorked);
        setRetirementPay(`₱${calculatedPay.toLocaleString()}`);
        setModalVisible(true);
    };
    
    

    const clearFields = () => {
        setDateHired(new Date());
        setUseManualYears(false);
        setManualYears('');
        setDailyRate('');
        setDateRetirement(new Date());
        setAge('');
        setRetirementPay('');
        setShowDateHiredPicker(false);
        setShowDateRetirementPicker(false);
        setActiveButton(null);
    };



    return (
        <View style={styles.container}>
            <LinearGradient colors={['#2a2a2a', '#000']} style={styles.background} />
            <View style={styles.header}>
                <Ionicons name="arrow-back-outline" size={32} color="white" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>RETIREMENT PAY</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.formContainer}>
                <Text style={styles.label}>Date Hired:</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.toggleButton, styles.yellowButton]}
                        onPress={() => {
                            setUseManualYears(false);
                            setActiveButton("picker");
                            setShowDateHiredPicker(true);
                        }}
                    >
                        <Text style={[styles.toggleButtonText, activeButton === "picker" && { fontWeight: "bold" }]}>
                            Calendar
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.toggleButton, styles.yellowButton]}
                        onPress={() => {
                            setUseManualYears(true);
                            setActiveButton("manual");
                        }}
                    >
                        <Text style={[styles.toggleButtonText, activeButton === "manual" && { fontWeight: "bold" }]}>
                            Manual Input
                        </Text>
                    </TouchableOpacity>
                </View>


                    {activeButton === "manual" && (
                        <TextInput 
                            style={styles.input} 
                            value={manualYears === "0" ? "" : manualYears} // Ensures placeholder is visible
                            onChangeText={setManualYears} 
                            keyboardType="numeric" 
                            placeholder="Enter Number of Years Worked" 
                        />
                    )}

                    {activeButton === "picker" && (
                        <TouchableOpacity 
                            style={styles.dateInput} 
                            onPress={() => setShowDateHiredPicker(true)}
                        >
                            <Text>{dateHired.toDateString()}</Text> 
                        </TouchableOpacity>
                    )}

                    {showDateHiredPicker && (
                        <DateTimePicker
                            value={dateHired}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDateHiredPicker(false); // Hide picker after selection
                                if (selectedDate) setDateHired(selectedDate);
                            }}
                        />
                    )}

                    <Text style={styles.label}>Daily Rate:</Text>
                    <TextInput 
                        style={styles.input} 
                        value={dailyRate} 
                        onChangeText={setDailyRate} 
                        keyboardType="numeric" 
                        placeholder="Enter Daily Rate" 
                    />

                    <Text style={styles.label}>Age:</Text>
                    <TextInput 
                        style={styles.input} 
                        value={age} 
                        onChangeText={setAge} 
                        keyboardType="numeric" 
                        placeholder="Enter Age" 
                    />

                    <Text style={styles.label}>Date of Retirement:</Text>
                    <TouchableOpacity style={styles.dateInput} onPress={() => setShowDateRetirementPicker(true)}>
                        <Text>{dateRetirement.toDateString()}</Text>
                    </TouchableOpacity>
                    {showDateRetirementPicker && (
                        <DateTimePicker
                            value={dateRetirement}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDateRetirementPicker(false);
                                if (selectedDate) setDateRetirement(selectedDate);
                            }}
                        />
                    )}

                    <TouchableOpacity style={styles.calculateButton} onPress={calculateRetirementPay}>
                        <Text style={styles.calculateButtonText}>CALCULATE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.clearButton} onPress={clearFields}>
                        <Text style={styles.clearButtonText}>CLEAR</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Calculation Results</Text>

                        <View style={styles.resultBox}> 
                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>Date Hired:</Text>
                                <Text style={styles.resultValue}>{finalDateHired}</Text> {/* Now shows either a date or "Number of Years: X" */}
                            </View>


                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>Daily Rate:</Text>
                                <Text style={styles.resultValue}>₱{dailyRate}</Text>
                            </View>

                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>Age:</Text>
                                <Text style={styles.resultValue}>{age}</Text>
                            </View>

                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>Date of Retirement:</Text>
                                <Text style={styles.resultDOR}>{dateRetirement.toDateString()}</Text>
                            </View>

                                <Text style={styles.resultLabel}></Text>
                                <Text style={styles.resultLabel}>Retirement Pay:</Text>
                                <Text style={styles.resultFinal}>{retirementPay}</Text>
                            </View>

                            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.closeButtonText}>CLOSE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            </Modal>
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
        marginLeft: 50,
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

export default RetirementPay;