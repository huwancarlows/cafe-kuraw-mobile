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
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';


const SeparationPay = () => {
    const navigation = useNavigation();

    const [dateHired, setDateHired] = useState(null); 
    const [dateTerminated, setDateTerminated] = useState(null); 
    const [dailyRate, setDailyRate] = useState('');
    const [Reason, setReason] = useState('');
    const [separationPay, setSeparationPay] = useState(0);
    const [showDateHiredPicker, setShowDateHiredPicker] = useState(false);
    const [showDateTerminatedPicker, setShowDateTerminatedPicker] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    

    const handleCalculate = () => {
        if (!dailyRate || !Reason || !dateHired || !dateTerminated) {
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

        if (["Retirement", "Closure", "Sickness not curable"].includes(Reason)) {
            computedPay = yearsWorked * parsedDailyRate * 26 * 0.5;
            comment = "Half Month Pay";
        } else if (["Installation", "Redundancy", "Position not feasible", "Sickness not curable"].includes(Reason)) {
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
        setReason('null');

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
            {/* Date Hired */}
            <Text style={styles.label}>Date Hired:</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowDateHiredPicker(true)}>
                <Text>{dateHired ? dateHired.toDateString() : "Select Date"}</Text>
            </TouchableOpacity>
            {showDateHiredPicker && (
                <DateTimePicker
                    value={dateHired || new Date()} // Ensure it's always a valid date
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDateHiredPicker(false);
                        if (selectedDate) setDateHired(selectedDate);
                    }}
                />
            )}

            {/* Date of Termination */}
            <Text style={styles.label}>Date of Termination:</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowDateTerminatedPicker(true)}>
                <Text>{dateTerminated ? dateTerminated.toDateString() : "Select Date"}</Text>
            </TouchableOpacity>
            {showDateTerminatedPicker && (
                <DateTimePicker
                    value={dateTerminated || new Date()} // Ensure it's always a valid date
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDateTerminatedPicker(false);
                        if (selectedDate) setDateTerminated(selectedDate);
                    }}
                />
            )}


                    <Text style={styles.label}>Daily Rate:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={dailyRate}
                        onChangeText={setDailyRate}
                        placeholder="Enter daily rate"
                    />
                    
                    <Text style={styles.label}>Reason:</Text>
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
                            onPress={() => setReason(reason)}
                        >
                            <View style={styles.radioButton}>
                                {Reason === reason && <View style={styles.radioButtonSelected} />}
                            </View>
                            <Text style={styles.radioLabel}>{reason}</Text>
                        </TouchableOpacity>
                    ))}

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

                            <Text style={styles.resultLabel}>Date Hired:</Text>
                            <Text style={styles.resultValue}>{dateHired ? dateHired.toDateString() : 'N/A'}</Text>
                            <Text style={styles.resultLabel}>Date of Termination:</Text>
                            <Text style={styles.resultValue}>{dateTerminated ? dateTerminated.toDateString() : 'N/A'}</Text>

                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>Daily Rate:</Text>
                                <Text style={styles.resultValue}>₱{dailyRate}</Text>
                            </View>

                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>Reason:</Text>
                                <Text style={styles.resultValue}>{Reason}</Text>
                            </View>

                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>Separation Pay:</Text>
                                <Text style={styles.resultValue}>₱{separationPay.toFixed(2)}</Text>
                            </View>
                            <Text style={styles.resultNote}>
                            Note:{" "}
                            {Reason === "Retirement" || Reason === "Closure" || Reason === "Sickness not curable"
                                ? "Half Month Pay"
                                : Reason === "Installation" || Reason === "Redundancy" || Reason === "Position not feasible"
                                ? "Full Month Pay"
                                : "N/A"}
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
    resultNote: {
        fontSize: scaleFont(16),
        color: '#555',  
        fontWeight: '500',
        textAlign: 'center',
        marginTop: scaleSize(10), 
        paddingHorizontal: scaleSize(15), 
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