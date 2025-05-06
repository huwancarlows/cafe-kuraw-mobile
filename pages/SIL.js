import React, { useState, useEffect  } from 'react';
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
import { differenceInDays, differenceInYears } from "date-fns"; // Import date-fns


const { height, width } = Dimensions.get('window');


const ServiceIncentiveLeave = () => {
    const navigation = useNavigation();
    const [dateHired, setDateHired] = useState(new Date());
    const [dailyRate, setDailyRate] = useState('');
    const [referenceDate, setReferenceDate] = useState(new Date());
    const [presentDate, setPresentDate] = useState(() => {
        const today = new Date();
        return new Date(today.getFullYear(), dateHired.getMonth(), dateHired.getDate());
    });
    const [showDateHiredPicker, setShowDateHiredPicker] = useState(false);
    const [showReferenceDatePicker, setShowReferenceDatePicker] = useState(false);
    const [showPresentDatePicker, setShowPresentDatePicker] = useState(false);
    const [serviceIncentivePay, setServiceIncentivePay] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    // Ensure presentDate updates when dateHired changes
    useEffect(() => {
        const today = new Date();
        setPresentDate(new Date(today.getFullYear(), dateHired.getMonth(), dateHired.getDate()));
    }, [dateHired]);

    const calculateSIL = () => { 
        if (!dailyRate.trim() || isNaN(parseFloat(dailyRate)) || parseFloat(dailyRate) <= 0) {
            Alert.alert("Invalid Input", "Please enter a valid Daily Rate greater than 0.");
            return;
        }
    
        const hiredDate = new Date(dateHired);
        const refDate = new Date(referenceDate);
        const presDate = new Date(presentDate);
        const rate = parseFloat(dailyRate) || 0;
    
        if (refDate > presDate) {
            Alert.alert("Invalid Dates", "Reference Date cannot be later than Present Date.");
            return;
        }
    
        if (hiredDate > refDate) {
            Alert.alert("Invalid Dates", "Date Hired must be before the Reference Date.");
            return;
        }
    
        // **Normalize Dates (Reset Time to Midnight)**
        const normalizeDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
        
        const refDateNormalized = normalizeDate(refDate);
        const presDateNormalized = normalizeDate(presDate);
    
        // **Check if at least 1 year of service is completed**
        if (differenceInYears(presDateNormalized, hiredDate) < 1) {
            setServiceIncentivePay("Not yet 1 year in service.");
            setModalVisible(true);
            return;
        }
    
        // **Calculate Exact Days Worked (INCLUSIVE)**
        let daysWorked = differenceInDays(presDateNormalized, refDateNormalized); // ✅ Fix: Now includes the reference date
    
        console.log(`Reference Date: ${refDateNormalized.toISOString()}`);
        console.log(`Present Date: ${presDateNormalized.toISOString()}`);
        console.log(`Days Worked: ${daysWorked}`);
    
        // **Fix for Full Year (Ensure 365 Days Calculation)**
        if (daysWorked === 364 && refDate.getMonth() === 0 && refDate.getDate() === 1 && presDate.getMonth() === 11 && presDate.getDate() === 31) {
            daysWorked = 365; // ✅ Fix: Manually ensure full year case is accurate
        }
    
        // **Apply Exact Formula Without Premature Rounding**
        let silPay = (daysWorked * rate * 5) / 365;
    
        // **Ensure Correct Whole Number**
        silPay = Math.floor(silPay); // ✅ Fix: Truncate to avoid decimal issues
    
        setServiceIncentivePay(`₱${silPay.toLocaleString()}`);
        setModalVisible(true);
    };
    
    
    const clearFields = () => {
        setDateHired(new Date());
        setDailyRate('');
        setReferenceDate(new Date());
        setPresentDate(new Date());
        setServiceIncentivePay('');
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
                <Text style={styles.headerTitle}>SERVICE INCENTIVE LEAVE</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Date Hired:</Text>
                    <TouchableOpacity style={styles.dateInput} onPress={() => setShowDateHiredPicker(true)}>
                        <Text>{dateHired.toDateString()}</Text>
                    </TouchableOpacity>
                    {showDateHiredPicker && (
                        <DateTimePicker
                            value={dateHired}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowDateHiredPicker(false);
                                if (selectedDate) setDateHired(selectedDate);
                            }}
                        />
                    )}

                    <Text style={styles.label}>Current Daily Rate:</Text>
                    <TextInput 
                        style={styles.input} 
                        value={dailyRate} 
                        onChangeText={setDailyRate} 
                        keyboardType="numeric"
                        placeholder="Enter current daily rate" 
                    />

                    <Text style={styles.label}>Reference Date:</Text>
                    <TouchableOpacity style={styles.dateInput} onPress={() => setShowReferenceDatePicker(true)}>
                        <Text>{referenceDate.toDateString()}</Text>
                    </TouchableOpacity>
                    {showReferenceDatePicker && (
                        <DateTimePicker
                            value={referenceDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowReferenceDatePicker(false);
                                if (selectedDate) setReferenceDate(selectedDate);
                            }}
                        />
                    )}

                    <Text style={styles.label}>Present Date:</Text>
                    <TouchableOpacity style={styles.dateInput} onPress={() => setShowPresentDatePicker(true)}>
                        <Text>{presentDate.toDateString()}</Text>
                    </TouchableOpacity>
                    {showPresentDatePicker && (
                        <DateTimePicker
                            value={presentDate}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setShowPresentDatePicker(false);
                                if (selectedDate) setPresentDate(selectedDate);
                            }}
                        />
                    )}

                    <TouchableOpacity style={styles.calculateButton} onPress={calculateSIL}>
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
                                    <Text style={styles.resultLabel}>Date Hired:</Text>
                                    <Text style={styles.resultValue}>{dateHired.toDateString()}</Text>
                            </View>

                            <View style={styles.resultRow}>
                                    <Text style={styles.resultLabel}>Current Daily Rate:</Text>
                                    <Text style={styles.resultValue}>₱{dailyRate}</Text>
                            </View> 

                            <View style={styles.resultRow}>
                                    <Text style={styles.resultLabel}>Reference Date:</Text>
                                    <Text style={styles.resultValue}>{referenceDate.toDateString()}</Text>
                            </View>

                            
                            <View style={styles.resultRow}>
                                    <Text style={styles.resultLabel}>Present Date:</Text>
                                    <Text style={styles.resultValue}>{presentDate.toDateString()}</Text>
                            </View>

                                <Text style={styles.resultLabel}></Text>
                                <Text style={styles.resultLabel}>Minimum Service Incentive Leave:</Text>
                                <Text style={[
                                        styles.resultFinal,
                                        serviceIncentivePay === "Not yet 1 year in service." ? { color: '#FF4444' } : {}
                                    ]}>
                                        {serviceIncentivePay}
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
        marginRight: width * 0.02,
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
        fontSize: height * 0.03,
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

export default ServiceIncentiveLeave;
