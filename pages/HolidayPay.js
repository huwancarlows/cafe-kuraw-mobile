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
    Alert,
    Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchHolidays } from '../services/HolidayService';

const { width } = Dimensions.get('window');

const HolidayPay = ({ navigation }) => {
    const [dailyRate, setActualDailyRate] = useState('');
    const [holiday, setNumberHoliday] = useState('');
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [showFromDatePicker, setShowFromDatePicker] = useState(false);
    const [showToDatePicker, setShowToDatePicker] = useState(false);
    const [workType, setWorkType] = useState('worked');
    const [totalHolidayPay, setTotalHolidayPay] = useState('');
    const [holidays, setHolidays] = useState([]);
    const [isOffline, setIsOffline] = useState(false);;
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        checkConnection();
    }, []);

    useEffect(() => {
        if (!isOffline) {
            loadHolidays();
        } else {
            loadCachedHolidays();
        }
    }, [isOffline]);

    useEffect(() => {
        calculateHolidaysInPeriod();
    }, [fromDate, toDate, holidays, isOffline]);

    const checkConnection = async () => {
        const state = await NetInfo.fetch();
        setIsOffline(!state.isConnected);
    };


    const loadHolidays = async () => {
        try {
            const data = await fetchHolidays();
            setHolidays(data);
            await AsyncStorage.setItem('cachedHolidays', JSON.stringify(data));
            calculateHolidaysInPeriod(data); // Ensure calculation happens after fetch ✅
        } catch (error) {
            console.log("Error fetching holidays:", error);
        }
    };

    const loadCachedHolidays = async () => {
        try {
            const cachedData = await AsyncStorage.getItem('cachedHolidays');
            if (cachedData) {
                const parsedHolidays = JSON.parse(cachedData);
                setHolidays(parsedHolidays);
                setNumberHoliday(parsedHolidays.length.toString()); // ✅ Preload into input field
            } else {
                setHolidays([]);
                setNumberHoliday("0"); // ✅ Default to 0 if no cached holidays
            }
        } catch (error) {
            console.log("Error loading cached holidays:", error);
        }
    };

    const calculateHolidaysInPeriod = (overrideHolidays = null) => {
        const holidaysToUse = overrideHolidays || holidays;
    
        const filteredHolidays = holidaysToUse.filter(holiday => {
            const holidayDate = new Date(holiday.holiday_date);
            return holidayDate >= fromDate && holidayDate <= toDate;
        });
    
        setNumberHoliday(filteredHolidays.length.toString());
    };

    const handleCalculate = () => {
           if (!dailyRate) {
               Alert.alert('Error', 'Please provide a valid daily rate.');
               return;
           }
   
           const rate = parseFloat(dailyRate);
           const holidaysCount = parseInt(holiday, 10);
   
           if (holidaysCount === 0) {
               Alert.alert('No Holidays', 'No holidays are found in this period.');
               return;
           }
   
           let totalPay = workType === 'worked' ? rate * holidaysCount * 2 : rate * holidaysCount;
           setTotalHolidayPay(totalPay.toFixed(2));
           setModalVisible(true);
    };

    const clearFields = () => {
        setNumberHoliday('');
        setActualDailyRate('');
    };

    return (
        <View style={styles.container}>
                   <LinearGradient colors={['#2a2a2a', '#000']} style={styles.background} />
                   <View style={styles.header}>
                       <Ionicons name="arrow-back-outline" size={32} color="white" onPress={() => navigation.goBack()} />
                       <Text style={styles.headerTitle}>HOLIDAY PAY</Text>
                   </View>
          <ScrollView contentContainerStyle={styles.content}>
                          <View style={styles.formContainer}>
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
                    <Text style={styles.label}>No. of Holidays within the Period:</Text>
                    <TextInput
    style={styles.input}
    placeholder="0"
    value={holiday}
    onChangeText={(text) => setNumberHoliday(text)}
    keyboardType="numeric"
    editable={isOffline} // ✅ Editable as long as user is offline
/>

                    <Text style={styles.label}>Actual Daily Rate:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder=""
                        value={dailyRate}
                        onChangeText={setActualDailyRate}
                        keyboardType="numeric"
                    />
                    <View style={styles.radioContainer}>
                        {/* Worked Radio Button */}
                        <TouchableOpacity onPress={() => setWorkType('worked')} style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, workType === 'worked' && styles.radioButtonSelected]} />
                            <Text style={styles.radioLabel}>Worked</Text>
                        </TouchableOpacity>

                        {/* Unworked Radio Button */}
                        <TouchableOpacity onPress={() => setWorkType('unworked')} style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, workType === 'unworked' && styles.radioButtonSelected]} />
                            <Text style={styles.radioLabel}>Unworked</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
                        <Text style={styles.calculateButtonText}>CALCULATE</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.clearButton} onPress={clearFields}>
                        <Text style={styles.clearButtonText}>CLEAR</Text>
                    </TouchableOpacity>

                </View>
                </ScrollView>

                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Calculation Results</Text>

                            <View style={styles.resultContainer}>
                                 <View style={styles.resultRow}>
                                    <Text style={styles.resultLabel}>Period:</Text>
                                        <Text style={styles.resultValue}>
                                        {fromDate ? fromDate.toLocaleDateString() : "N/A"} - {toDate ? toDate.toLocaleDateString() : "N/A"}
                                    </Text>
                                 </View>
                                

                                <View style={styles.resultRow}>
                                    <Text style={styles.resultLabel}>No. of Holidays:</Text>
                                    <Text style={styles.resultValue}>{holiday} day</Text>
                                </View>


                                <View style={styles.resultRow}>
                                    <Text style={styles.resultLabel}>Actual Daily Rate:</Text>
                                       <Text style={styles.resultValue}>₱{Number(dailyRate).toLocaleString()}</Text>
                                </View>

                                <View style={styles.resultRow}>
                                    <Text style={styles.resultLabel}>Work Type:</Text>
                                    <Text style={styles.resultValue}>
                                        {workType === 'worked' ? 'Worked' : 'Unworked'}
                                    </Text>
                                </View>
                                 <Text style={styles.resultLabel}></Text>
                                     <Text style={styles.resultLabel}>Holiday Pay:</Text>
                                     <Text style={styles.resultFinal}>₱{Number(totalHolidayPay).toLocaleString()}</Text>
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
            marginLeft: 90,
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

    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 4,  // Reduced padding
        marginLeft: 40,  // Adjusted to align with the input field
    },

    radioContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'center',
    },

    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        marginTop: 10,
        marginLeft:45,
    },

    radioButton: {
        height: 18,
        width: 18,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 5,
    },

    radioButtonSelected: {
        backgroundColor: '#FFD700',
        borderColor: '#FFD700',
    },

    radioLabel: {
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
        textAlign: 'center',
        marginHorizontal: 5,
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
    
});

export default HolidayPay;