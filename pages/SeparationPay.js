import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SeparationPay = () => {
    const navigation = useNavigation();

    const [dateHired, setDateHired] = useState('');
    const [dateTerminated, setDateTerminated] = useState('');
    const [dailyRate, setDailyRate] = useState('');
    const [terminationReason, setTerminationReason] = useState('');
    const [separationPay, setSeparationPay] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);

    const handleCalculate = () => {
        if (!dailyRate || !terminationReason || !dateHired || !dateTerminated) {
            Alert.alert("Invalid Input", "Please enter all required fields.");
            return;
        }

        const hiredDate = new Date(dateHired);
        const terminatedDate = new Date(dateTerminated);
        const parsedDailyRate = parseFloat(dailyRate); // Convert to number

        if (isNaN(parsedDailyRate)) {
            Alert.alert("Invalid Input", "Daily rate must be a number.");
            return;
        }

        const daysWorked = (terminatedDate - hiredDate) / (1000 * 60 * 60 * 24);
        const yearsWorked = daysWorked / 365;

        if (yearsWorked < 0.5) {
            Alert.alert("Not Eligible", "Requires at least 6 months.");
            return;
        }

        let computedPay = 0;
        let comment = "";

        if (["Retirement", "Closure", "Sickness not curable"].includes(terminationReason)) {
            computedPay = yearsWorked * parsedDailyRate * 26 * 0.5;
            comment = "Half Month Pay";
        } else if (["Installation", "Redundancy", "Position not feasible", "Sickness not curable"].includes(terminationReason)) {
            computedPay = yearsWorked * parsedDailyRate * 26;
            comment = "Full Month Pay";
        }

        setSeparationPay(computedPay);
        setModalVisible(true);
    };
    const clearFields = () => {
        setDateHired('');
        setDailyRate('');
        setDateTerminated('');
        setTerminationReason('null');

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
                    onPress={() => navigation.navigate('Home')} 
                />
                <Text style={styles.headerTitle}>SEPARATION PAY</Text>
            </View>
            
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Date Hired:</Text>
                    <TextInput
                        style={styles.input}
                        value={dateHired}
                        onChangeText={setDateHired}
                        placeholder="YYYY-MM-DD"
                        keyboardType="default"
                    />
                    
                    <Text style={styles.label}>Daily Rate:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={dailyRate}
                        onChangeText={setDailyRate}
                        placeholder="Enter daily rate"
                    />
                    
                    <Text style={styles.label}>Reason for Termination:</Text>
                    {["Retirement", 
                    "Closure", 
                    "Sickness not curable", 
                    "Installation", 
                    "Redundancy", 
                    "Position not feasible", 
                    "Voluntary Resignation"
                    ].map((reason, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.radioButtonContainer}
                            onPress={() => setTerminationReason(reason)}
                        >
                            <View style={styles.radioButton}>
                                {terminationReason === reason && <View style={styles.radioButtonSelected} />}
                            </View>
                            <Text style={styles.radioLabel}>{reason}</Text>
                        </TouchableOpacity>
                    ))}
                    
                    <Text style={styles.label}>Date of Termination:</Text>
                    <TextInput
                        style={styles.input}
                        value={dateTerminated}
                        onChangeText={setDateTerminated}
                        placeholder="YYYY-MM-DD"
                        keyboardType="default"
                    />
                    
                    <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
                        <Text style={styles.calculateButtonText}>CALCULATE</Text>
                    </TouchableOpacity>

                     <TouchableOpacity style={styles.clearButton} onPress={clearFields}>
                                            <Text style={styles.clearButtonText}>CLEAR</Text>
                                        </TouchableOpacity>
                </View>
            </ScrollView>

            {/* MODAL */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Calculation Results</Text>

                        <View style={styles.resultContainer}>
                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>Date Hired:</Text>
                                <Text style={styles.resultValue}>{dateHired}</Text>
                            </View>

                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>Daily Rate:</Text>
                                <Text style={styles.resultValue}>₱{dailyRate}</Text>
                            </View>

                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>Reason for Termination:</Text>
                                <Text style={styles.resultValue}>{terminationReason}</Text>
                            </View>

                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>Date of Termination:</Text>
                                <Text style={styles.resultValue}>{dateTerminated}</Text>
                            </View>

                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>Separation Pay:</Text>
                                <Text style={styles.resultValue}>₱{separationPay.toFixed(2)}</Text>
                            </View>
                            <Text style={styles.resultNote}>
                                {terminationReason === "Retirement" || terminationReason === "Closure" || terminationReason === "Sickness not curable" 
                                    ? "(Half Month Pay)" 
                                    : terminationReason === "Installation" || terminationReason === "Redundancy" || terminationReason === "Position not feasible" 
                                    ? "(Full Month Pay)" 
                                    : ""}
                            </Text>
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

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#000' 
    },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingTop: 60, 
        paddingHorizontal: 20, 
        paddingBottom: 20 
    },
    backIcon: { 
        marginRight: 10 
    },
    headerTitle: { 
        fontSize: 32, 
        fontWeight: 'bold', 
        color: '#fff', 
        textAlign: 'center', 
        flex: 1 
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
        color: '#000', 
        marginBottom: 5 
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
        color: '#000'
     },
    calculateButton: { 
        backgroundColor: '#FFD700', 
        paddingVertical: 15, 
        borderRadius: 8, 
        alignItems: 'center', 
        marginTop: 10 
    },
    calculateButtonText: { 
        color: '#000', 
        fontWeight: 'bold', 
        fontSize: 18 
    },
    modalContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(0,0,0,0.6)' 
    },
    modalContent: { 
        backgroundColor: '#fff', 
        padding: 20, 
        borderRadius: 10, 
        width: '80%', 
        alignItems: 'center' 
    },
    modalTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 15 
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
    closeButton: { 
        marginTop: 20, 
        padding: 10, 
        backgroundColor: 'red', 
        borderRadius: 5 
    },
    closeButtonText: { 
        color: '#fff', 
        fontWeight: 'bold'
    },
    
    radioButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#000",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    radioButtonSelected: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#000",
    },
    radioLabel: {
        fontSize: 16,
        color: "#000",
    },
});

export default SeparationPay;