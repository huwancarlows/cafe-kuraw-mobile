import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet,Dimensions,
    PixelRatio } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const { height, width } = Dimensions.get('window');

const FloatingButton = ({ onPress }) => {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      </View>
    );
  };
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
                daily = (monthly * 12) / 355;
            } else {
                daily =(monthly * 12) / 365;
            }
        } else {
            if (restDays === 1) {
                daily = (monthly * 12) / 313;
            } else if (restDays === 2) {
                daily = (monthly * 12) / 261;
            } else {
                daily = monthly / 26; 
            }
        }

        setDailySalary(Math.round(daily));
    };
   
    const clearFields = () => {
        setMonthlySalary('');
        setDailySalary('');
        setDailySalary('');
        setRestDayWork(false);  
        setHolidayWork(false);
        setRestDaysPerMonth('');
    }
    
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
                        {/* Close Button (X) */}
                    <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                        <Icon name="close" size={24} color="#333" />
                    </TouchableOpacity>
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

                        <TouchableOpacity style={styles.clearButton} onPress={clearFields}>
                                                <Text style={styles.clearButtonText}>CLEAR</Text>
                        </TouchableOpacity>

                        {dailySalary !== '' && (
                            <Text style={styles.result}>Daily Salary: ₱{dailySalary}</Text>
                        )}
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
        position: 'absolute',
        top: 65,
        right: 20,
        alignItems: 'center',
        justifyContent: 'center',
      },
      button: {
        width: 60,
        height: 60,
        borderRadius: 30, 
        backgroundColor: '#FFD700', 
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 8, 
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.6)',
      },
      
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        width: '85%',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: 18,
        borderRadius: 10,
        elevation: 8,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
        textAlign: 'center', 
    },
    input: {
        borderWidth: 1,
        borderColor: '#D1D1D1', 
        borderRadius: 8, 
        paddingVertical: 10, 
        paddingHorizontal: 12, 
        marginBottom: 12, 
        color: '#333', 
        backgroundColor: '#F9F9F9', 
        fontSize: 16, 
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 4,
    },
     
    radioGroupContainer: {
        marginBottom: 12,
    },

    radioLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#222',
        paddingLeft: 12, 
    },
    
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 6, 
    },
    
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20, 
        paddingVertical: 8, 
        paddingHorizontal: 12, 
        borderRadius: 6, 
    },
    
    radioText: {
        marginLeft: 8, 
        fontSize: 15, 
        color: '#444', 
        fontWeight: '500', 
    },
    
    calculateButton: {
        backgroundColor: '#FFD700',
        paddingVertical: height * 0.015, 
        borderRadius: scaleSize(8),
        alignItems: 'center',
        marginTop: height * 0.005,
    },
    calculateButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 20,
    },
    result: {
        marginTop: 15,
        fontSize: 22,
        color: '#333',
        textAlign: 'center',
        fontWeight: 'bold',
        backgroundColor: '#FFD700',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        alignSelf: 'center',
        minWidth: '60%',
    },
    
  
    clearButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: height * 0.015, // Reduced from 0.02
        borderRadius: 8,
        alignItems: 'center',
        marginTop: height * 0.005,
        width: '100%',
    },
    clearButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: scaleFont(18),
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 8,
        zIndex: 10,
    },
    
});
export default Conversion;