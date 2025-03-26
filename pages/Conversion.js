import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Conversion = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [monthlySalary, setMonthlySalary] = useState('');
    const [restDayWork, setRestDayWork] = useState(false);
    const [holidayWork, setHolidayWork] = useState(false);
    const [restDaysPerMonth, setRestDaysPerMonth] = useState('');
    const [dailySalary, setDailySalary] = useState('');

    useEffect(() => {
        // Disable holiday input if rest day work is NO
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
            if (holidayWork) {
                daily = (monthly * 12) / 365;
            } else {
                daily = monthly / 365;
            }
        } else {
            if (restDays === 1) {
                daily = (monthly * 12) / 313;
            } else if (restDays === 2) {
                daily = (monthly * 12) / 261;
            } else {
                daily = monthly / 26; // Default working days if no specific rest days
            }
        }

        setDailySalary(Math.round(daily));
    };


    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.assistiveTouch}
                onPress={() => setModalVisible(true)}
            >
                <Icon name="add-circle-outline" size={50} color="#fff" />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Salary Conversion</Text>

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
                                    <Icon
                                        name={restDayWork ? 'radio-button-on' : 'radio-button-off'}
                                        size={20}
                                        color={restDayWork ? '#4CAF50' : '#aaa'}
                                    />
                                    <Text style={styles.radioText}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setRestDayWork(false)} style={styles.radioOption}>
                                    <Icon
                                        name={!restDayWork ? 'radio-button-on' : 'radio-button-off'}
                                        size={20}
                                        color={!restDayWork ? '#4CAF50' : '#aaa'}
                                    />
                                    <Text style={styles.radioText}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {restDayWork && (
                            <View style={styles.radioGroupContainer}>
                                <Text style={styles.radioLabel}>Required to Work on Holidays?</Text>
                                <View style={styles.radioContainer}>
                                    <TouchableOpacity onPress={() => setHolidayWork(true)} style={styles.radioOption}>
                                        <Icon
                                            name={holidayWork ? 'radio-button-on' : 'radio-button-off'}
                                            size={20}
                                            color={holidayWork ? '#4CAF50' : '#aaa'}
                                        />
                                        <Text style={styles.radioText}>Yes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setHolidayWork(false)} style={styles.radioOption}>
                                        <Icon
                                            name={!holidayWork ? 'radio-button-on' : 'radio-button-off'}
                                            size={20}
                                            color={!holidayWork ? '#4CAF50' : '#aaa'}
                                        />
                                        <Text style={styles.radioText}>No</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {!restDayWork && (
                            <TextInput
                                placeholder="Number of Rest Days per Month"
                                keyboardType="numeric"
                                style={styles.input}
                                value={restDaysPerMonth}
                                onChangeText={setRestDaysPerMonth}
                                placeholderTextColor="#aaa"
                            />
                        )}

                        <TouchableOpacity
                            style={styles.calculateButton}
                            onPress={calculateDailySalary}
                        >
                            <Text style={styles.buttonText}>Calculate</Text>
                        </TouchableOpacity>

                        {dailySalary !== '' && (
                            <Text style={styles.result}>Daily Salary: ₱{dailySalary}</Text>
                        )}

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
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
        backgroundColor: 'transparent',
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    assistiveTouch: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        borderRadius: 30,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 20,
        borderRadius: 10,
        elevation: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#000',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginBottom: 15,
        paddingVertical: 8,
        color: '#000',
    },
    radioGroupContainer: {
        marginBottom: 15,
    },
    radioLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    radioText: {
        marginLeft: 5,
        fontSize: 14,
    },
    calculateButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    result: {
        marginTop: 20,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    closeButtonText: {
        color: '#FF6347',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Conversion;