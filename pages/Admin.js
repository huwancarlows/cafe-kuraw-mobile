import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    Text,
    TouchableOpacity,
    TextInput,
    Modal,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Sidebar from '../components/Sidebar';
import { fetchHolidays, createHoliday, updateHoliday, deleteHoliday } from '../services/HolidayService';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

// Import the separated styles
import styles from './AdminStyles';


const Admin = ({ navigation }) => {
    const [holidays, setHolidays] = useState([]);
    const [holidayName, setHolidayName] = useState('');
    const [holidayDate, setHolidayDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [selectedHoliday, setSelectedHoliday] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        loadHolidays();
    }, []);

    const loadHolidays = async () => {
        const data = await fetchHolidays();
        setHolidays(data);
    };

    const handleLogout = () => {
        navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
    };
    
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSetHoliday = async () => {
        if (!holidayName || !holidayDate) {
            Alert.alert('Error', 'Please enter both holiday name and date.');
            return;
        }

        const formattedDate = holidayDate.toISOString().split('T')[0];

        if (selectedHoliday) {
            await updateHoliday(selectedHoliday.id, holidayName, formattedDate);
            Alert.alert('Success', 'Holiday has been updated.');
        } else {
            await createHoliday(holidayName, formattedDate);
            Alert.alert('Success', 'Holiday has been created.');
        }

        resetForm();
        loadHolidays();
    };

    const handleDeleteHoliday = async () => {
        if (selectedHoliday) {
            await deleteHoliday(selectedHoliday.id);
            Alert.alert('Success', 'Holiday has been deleted.');
            resetForm();
            loadHolidays();
        }
    };

    const handleHolidaySelect = (day) => {
        const selected = holidays.find(h => h.holiday_date === day.dateString);
        if (selected) {
            setSelectedHoliday(selected);
            setHolidayName(selected.holiday_name);
            setHolidayDate(new Date(selected.holiday_date));
        } else {
            resetForm();
            setHolidayDate(new Date(day.dateString));
        }
        setShowModal(true);
    };

    const resetForm = () => {
        setHolidayName('');
        setHolidayDate(new Date());
        setSelectedHoliday(null);
        setShowModal(false);
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#2a2a2a', '#000']} style={styles.background} />

            <Sidebar
    isOpen={isSidebarOpen}
    toggleSidebar={toggleSidebar}
    onViewHolidays={loadHolidays}
    onAddHoliday={() => {
        resetForm();
        setShowModal(true);
    }}
    onNavigateHome={() => navigation.navigate('Home')}
    navigation={navigation} // Pass navigation to handle logout
/>


{/* Overlay to hide content when the sidebar is open */}
{isSidebarOpen && (
                <TouchableOpacity 
                    style={styles.overlay} 
                    onPress={toggleSidebar} 
                    activeOpacity={1}
                />
            )}

            {!isSidebarOpen && (
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Holiday Management</Text>
                    </View>


                <View style={styles.calendarContainer}>
                    <Calendar
                        onDayPress={handleHolidaySelect}
                        markedDates={{
                            ...holidays.reduce((acc, holiday) => {
                                acc[holiday.holiday_date] = {
                                    marked: true,
                                    dotColor: '#FFD700',
                                    selected: holiday.holiday_name === holidayName,
                                };
                                return acc;
                            }, {}),
                        }}
                        theme={{
                            calendarBackground: '#333',
                            dayTextColor: '#fff',
                            todayTextColor: '#FFD700',
                            selectedDayBackgroundColor: '#FFD700',
                            arrowColor: '#FFD700',
                            monthTextColor: '#FFD700',
                        }}
                    />
                </View>
                <ScrollView style={styles.holidayListContainer}>
                    <Text style={styles.listTitle}>Holiday List</Text>
                    {holidays.map((holiday) => (
                        <TouchableOpacity
                            key={holiday.id}
                            style={styles.holidayItem}
                            onPress={() => handleHolidaySelect({ dateString: holiday.holiday_date })}
                        >
                            <Text style={styles.holidayText}>{holiday.holiday_name}</Text>
                            <Text style={styles.holidayDate}>{new Date(holiday.holiday_date).toDateString()}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <Modal
                    visible={showModal}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={resetForm}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                                {selectedHoliday ? 'Edit Holiday' : 'Add Holiday'}
                            </Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Holiday Name"
                                placeholderTextColor="#888"
                                value={holidayName}
                                onChangeText={setHolidayName}
                            />

                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.dateText}>
                                    {holidayDate ? holidayDate.toDateString() : 'Select Date'}
                                </Text>
                            </TouchableOpacity>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={holidayDate}
                                    mode="date"
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        setHolidayDate(selectedDate || holidayDate);
                                    }}
                                />
                            )}

                            <TouchableOpacity style={styles.saveButton} onPress={handleSetHoliday}>
                                <Text style={styles.saveButtonText}>
                                    {selectedHoliday ? 'Update Holiday' : 'Add Holiday'}
                                </Text>
                            </TouchableOpacity>

                            {selectedHoliday && (
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={handleDeleteHoliday}
                                >
                                    <Text style={styles.deleteButtonText}>Delete Holiday</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={resetForm}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        )}
        </View>
    );
};


export default Admin;
