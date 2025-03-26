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

const { height, width } = Dimensions.get('window');

const NightShiftDifferential = () => {
    const navigation = useNavigation();
    const [nightHours, setNightHours] = useState('');
    const [dailyRate, setDailyRate] = useState('');
    const [totalNightShiftPay, setTotalNightShiftPay] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const calculateNightShiftPay = () => {
        if (!nightHours.trim() &&  !dailyRate.trim()) {
            Alert.alert("Input Required", "Please fill out all the required fields.");
            return;
        }

        const numNightHours = parseFloat(nightHours) || 0;
        const rate = parseFloat(dailyRate) || 0;

        const nightShiftPay = rate * (1 / 8) * numNightHours * 0.1;
        setTotalNightShiftPay(nightShiftPay.toFixed(2));
        setModalVisible(true);
    };

    const clearFields = () => {
        setNightHours('');
        setDailyRate('');
        setTotalNightShiftPay(null);
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
                <Text style={styles.headerTitle}>NIGHT SHIFT DIFFERENTIAL</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                    <Text style={styles.label}>Number of Hours Between 10PM to 6AM</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={nightHours}
                        onChangeText={setNightHours}
                        placeholder="Enter number of hours"
                        placeholderTextColor="#888"
                    />

                    <Text style={styles.label}>Actual Daily Rate</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={dailyRate}
                        onChangeText={setDailyRate}
                        placeholder="Enter daily rate"
                        placeholderTextColor="#888"
                    />

                    <TouchableOpacity style={styles.calculateButton} onPress={calculateNightShiftPay}>
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
                                <Text style={[styles.resultLabel, { textAlign: 'left' }]}>Number of Hours {'\n'}Between 10PM to 6AM:</Text>
                                <Text style={styles.resultValue}>{nightHours}</Text>
                            </View>

                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>Actual Daily Rate:</Text>
                                <Text style={styles.resultValue}>₱{dailyRate}</Text>
                            </View>

                            <View style={styles.resultRow}>
                                <Text style={styles.resultLabel}>Night Shift Differential:</Text>
                                <Text style={styles.resultValue}>₱{totalNightShiftPay || '0.00'}</Text>
                            </View>
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
        backgroundColor: '#000',
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: height * 0.08,
        paddingHorizontal: width * 0.05,
        paddingBottom: height * 0.02,
    },
    backIcon: {
        marginRight: width * 0.02,
    },
    headerTitle: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    content: {
        flexGrow: 1,
        alignItems: 'center',
        paddingBottom: height * 0.05,
    },
    formContainer: {
        marginTop: height * 0.05,
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: width * 0.05,
        elevation: 5,
    },
    label: {
        fontSize: width * 0.040,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: height * 0.005,
    },
    input: {
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.04,
        marginBottom: height * 0.02,
        color: '#000',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        width: '85%',
        paddingVertical: height * 0.025,
        paddingHorizontal: width * 0.06,
        alignItems: 'center',
        elevation: 10,
    },
    modalTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: height * 0.02,
    },
    calculateButton: {
        backgroundColor: '#FFD700',
        paddingVertical: height * 0.02,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: height * 0.015,
        width: '100%',
    },
    calculateButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: width * 0.05,
    },
    clearButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: height * 0.02,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: height * 0.015,
        width: '100%',
    },
    clearButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: width * 0.045,
    },
    resultBox: {
        backgroundColor: '#f7f7f7',
        borderRadius: scaleSize(10),
        paddingVertical: scaleSize(17),
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
        fontSize: scaleFont(19),
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',  // Center the value
    },
    closeButton: {
        marginTop: height * 0.025,
        backgroundColor: '#FFD700',
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.1,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: height * 0.025,
    },
    closeButtonText: {
        fontSize: width * 0.045,
        fontWeight: 'bold',
        color: '#222',
    },
});

export default NightShiftDifferential;
