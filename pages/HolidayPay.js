import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Dimensions,
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
                    onPress={() => navigation.navigate('Home')} 
                />
                <Text style={styles.headerTitle}>HOLIDAY PAY</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
                                    <Text style={styles.resultValue}>{holiday} day/s</Text>
                                </View>


                                <View style={styles.resultRow}>
                                    <Text style={styles.resultLabel}>Actual Daily Rate:</Text>
                                    <Text style={styles.resultValue}>₱ {dailyRate} </Text>
                                </View>

                                <View style={styles.resultRow}>
                                    <Text style={styles.resultLabel}>Work Type:</Text>
                                    <Text style={styles.resultValue}>
                                        {workType === 'worked' ? 'Worked' : 'Unworked'}
                                    </Text>
                                </View>
                            
                                <View style={styles.resultRow}>
                                     <Text style={styles.resultLabel}>Total Holiday Pay:</Text>
                                     <Text style={styles.resultValue}>₱{totalHolidayPay}</Text>
                                </View>

                                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.closeButtonText}>CLOSE</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
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
        marginTop: 30,
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
        marginLeft:90,
    },
    
});

export default HolidayPay;