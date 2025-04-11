import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Dimensions, PixelRatio } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { height, width } = Dimensions.get('window');

const Conversion = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [monthlySalary, setMonthlySalary] = useState('');
    const [restDayWork, setRestDayWork] = useState(false);
    const [holidayWork, setHolidayWork] = useState(false);
    const [restDaysPerMonth, setRestDaysPerMonth] = useState('');
    const [dailySalary, setDailySalary] = useState('');

    useEffect(() => {
        if (!restDayWork) setHolidayWork(false);
    }, [restDayWork]);

    const calculateDailySalary = () => {
        const monthly = parseFloat(monthlySalary) || 0;
        const restDays = parseInt(restDaysPerMonth) || 0;

        if (monthly <= 0) {
            alert('Please enter a valid monthly salary.');
            return;
        }

        let daily = 0;

        if (restDayWork) {
        // Calculate daily based on holidayWork or regular work
        if (holidayWork) {
            daily = (monthly * 12) / 395;
        } else {
            daily = (monthly * 12) / 365;
        }
        } else {
            if (restDays > 2) {
                alert('Invalid input');
            } else {
                if (restDays === 0) {
                    daily = (monthly * 12) / 365;
                } else if (restDays === 1) {
                    daily = (monthly * 12) / 313;
                } else if (restDays === 2) {
                    daily = (monthly * 12) / 261;
                } else {
                    daily = monthly / 26;
                }
            }
        }
        daily = Math.floor(daily);
        setDailySalary(daily);
    };

    const clearFields = () => {
        setMonthlySalary('');
        setDailySalary('');
        setRestDayWork(false);
        setHolidayWork(false);
        setRestDaysPerMonth('');
    };

    return (
        <>
            {/* Floating Button to Open Modal */}
            <TouchableOpacity style={styles.floatingButton} onPress={() => setModalVisible(true)}>
                <Icon name="swap-vertical" size={30} color="black" />
            </TouchableOpacity>

            {/* Salary Calculator Modal */}
            <Modal transparent={true} visible={modalVisible} animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.sidebar}>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Icon name="close" size={24} color="#000000" />
                        </TouchableOpacity>

                        <Text style={styles.title}>Salary Conversion</Text>

                        <Text style={styles.label}>Basic Monthly Salary:</Text>
                        <TextInput
                            placeholder="Basic Monthly Salary"
                            keyboardType="numeric"
                            style={styles.input}
                            value={monthlySalary}
                            onChangeText={setMonthlySalary}
                            placeholderTextColor="#aaa"
                        />

                        <View style={styles.radioGroupContainer}>
                            <Text style={styles.radioLabel}>Required to Work on Rest Days?</Text>
                            <View style={styles.radioContainer}>
                                <TouchableOpacity onPress={() => setRestDayWork(true)} style={styles.radioOption}>
                                    <Icon name={restDayWork ? 'radio-button-on' : 'radio-button-off'} size={20} color={restDayWork ? '#FFD700' : '#aaa'} />
                                    <Text style={styles.radioText}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setRestDayWork(false)} style={styles.radioOption}>
                                    <Icon name={!restDayWork ? 'radio-button-on' : 'radio-button-off'} size={20} color={!restDayWork ? '#FFD700' : '#aaa'} />
                                    <Text style={styles.radioText}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {restDayWork && (
                            <View style={styles.radioGroupContainer}>
                                <Text style={styles.radioLabel}>Required to Work on Holidays?</Text>
                                <View style={styles.radioContainer}>
                                    <TouchableOpacity onPress={() => setHolidayWork(true)} style={styles.radioOption}>
                                        <Icon name={holidayWork ? 'radio-button-on' : 'radio-button-off'} size={20} color={holidayWork ? '#FFD700' : '#aaa'} />
                                        <Text style={styles.radioText}>Yes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setHolidayWork(false)} style={styles.radioOption}>
                                        <Icon name={!holidayWork ? 'radio-button-on' : 'radio-button-off'} size={20} color={!holidayWork ? '#FFD700' : '#aaa'} />
                                        <Text style={styles.radioText}>No</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {!restDayWork && (
                            <>
                                <Text style={styles.label}>No. of Rest Days:</Text>
                                <TextInput
                                    placeholder="Number of Rest Days"
                                    keyboardType="numeric"
                                    style={styles.input}
                                    value={restDaysPerMonth}
                                    onChangeText={setRestDaysPerMonth}
                                    placeholderTextColor="#aaa"
                                />
                            </>
                        )}

                        <TouchableOpacity style={styles.calculateButton} onPress={calculateDailySalary}>
                            <Text style={styles.calculateButtonText}>CALCULATE</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.clearButton} onPress={clearFields}>
                            <Text style={styles.clearButtonText}>CLEAR</Text>
                        </TouchableOpacity>

                        {dailySalary !== '' && (
                            <Text style={styles.result}>Daily Salary: ₱{dailySalary.toLocaleString()} </Text>
                        )}
                    </View>
                </View>
            </Modal>
        </>
    );
};



const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        bottom: 80,  // Reduced space at the bottom
        right: 28,
        backgroundColor: '#FFD700',
        width: 60,
        height: 55,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 4,
        elevation: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    sidebar: {
        width: 280, // Slightly narrower sidebar
        backgroundColor: '#fff',
        paddingVertical: 20,  // Reduced padding for a compact look
        paddingHorizontal: 18, // Reduced horizontal padding
        borderTopLeftRadius: 25, // Slightly rounded corners
        borderBottomLeftRadius: 25,
        elevation: 10,
    },
    title: {
        fontSize: 26, // Slightly smaller title size
        fontWeight: '900',
        marginBottom: 12,  // Reduced margin
        color: '#333',
        textAlign: 'center',
    },
    label: {
        fontSize: 14, // Reduced font size for labels
        fontWeight: '600',
        marginBottom: 6, // Reduced margin
        color: '#333',
        marginLeft: 13,
    },
    input: {
        width: '90%',
        height: 48,  // Slightly smaller height for input
        borderWidth: 1.5,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingVertical: 10,  // Reduced padding for inputs
        paddingHorizontal: 12,
        marginBottom: 12,  // Reduced bottom margin
        marginLeft: 10,
        color: '#333',
        backgroundColor: '#f9f9f9',
        fontSize: 16,
        fontFamily: 'Roboto',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        textAlignVertical: 'center',
    },

    radioGroupContainer: {
        marginBottom: 10,  // Reduced margin for compact design
    },
    radioLabel: {
        fontSize: 14,  // Reduced font size for radio label
        fontWeight: '600',
        marginBottom: 6,
        color: '#333',
        marginLeft: 13,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 4,  // Reduced padding
        marginLeft: 40,  // Adjusted to align with the input field
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 18,  // Slightly reduced margin between options
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: '#F1F1F1',
        color: '#FFD700',
    },
    radioText: {
        marginLeft: 8,
        fontSize: 14,  // Reduced font size for radio text
        color: '#444',
    },
    calculateButton: {
        backgroundColor: '#FFD700',
        paddingVertical: height * 0.012,  // Consistent vertical padding
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 15,
        width: '90%',  // Ensures both buttons have the same width
        alignSelf: 'center',
    },
    calculateButtonText: {
        color: '#000',
        fontWeight: '900',
        fontSize: 15,
    },
    result: {
        marginTop: 12,  // Reduced margin
        fontSize: 26, // Slightly smaller font size
        color: '#333',
        textAlign: 'center',
        fontWeight: '700',
        // backgroundColor: '#FFD700',
        paddingVertical: 10,
        paddingHorizontal: 14,
        // borderRadius: 10,
        // elevation: 5,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.2,
        // shadowRadius: 6,
        alignSelf: 'center',
        minWidth: '60%',
    },
    clearButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: height * 0.012,  // Consistent vertical padding
        borderRadius: 6,
        alignItems: 'center',
        marginTop: 12,
        width: '90%',  // Same width as calculate button
        alignSelf: 'center',
    },
    clearButtonText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 15,
    },
    closeButton: {
        marginLeft: 220,  // Adjusted close button position
    }
});

export default Conversion;
