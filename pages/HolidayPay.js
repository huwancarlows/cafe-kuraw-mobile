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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
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

    useEffect(() => {
        loadHolidays();
    }, []);

    useEffect(() => {
        calculateHolidaysInPeriod();
    }, [fromDate, toDate, holidays]);

    const loadHolidays = async () => {
        const data = await fetchHolidays();
        setHolidays(data);
    };

    const calculateHolidaysInPeriod = () => {
        const filteredHolidays = holidays.filter(holiday => {
            const holidayDate = new Date(holiday.holiday_date);
            return holidayDate >= fromDate && holidayDate <= toDate;
        });
        setNumberHoliday(filteredHolidays.length > 0 ? filteredHolidays.length.toString() : '0');
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
                        editable={false} 
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
                        <TouchableOpacity onPress={() => setWorkType('worked')} style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, workType === 'worked' && styles.radioButtonSelected]} />
                            <Text style={styles.radioLabel}>Worked</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setWorkType('unworked')} style={styles.radioButtonContainer}>
                            <View style={[styles.radioButton, workType === 'unworked' && styles.radioButtonSelected]} />
                            <Text style={styles.radioLabel}>Unworked</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.label}>Total Holiday Pay:</Text>
                    <Text style={styles.result}>{`PHP ${totalHolidayPay}`}</Text>
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
        top: '2%',
        width: '90%',
        height: '95%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        elevation: 5,
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

    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },

    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#000',
    },
   
    input: {
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginTop:10,
        marginBottom: 15,
        fontSize: 16,
        color: '#000',
        backgroundColor: '#fff',
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
    dateText: {
        fontSize: 16,
    },
    toText: {
        fontSize: 16,
        fontWeight: "bold",
        marginHorizontal: 10,
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

    result: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
        color: '#000',
    },
    calculateButton: {
        backgroundColor: '#FFD700', // Bright yellow color
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    calculateButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default HolidayPay;  