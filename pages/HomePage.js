import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const iconButtons = [
  { label: 'Minimum Wage', icon: <FontAwesome5 name="hand-holding-usd" size={30} color="black" />, route: 'MinimumWage' },
  { label: 'Nightshift Differential', icon: <Ionicons name="moon" size={30} color="black" />, route: 'NightShiftDiff' },
  { label: 'Separation Pay', icon: <MaterialIcons name="logout" size={32} color="black" />, route: 'SeparationPay' },
  { label: 'Overtime Pay', icon: <FontAwesome5 name="clock" size={30} color="black" />, route: 'OvertimePay' },
  { label: 'Premium Pay', icon: <FontAwesome5 name="crown" size={30} color="black" />, route: 'PremiumPay' },
  { label: 'Holiday Pay', icon: <FontAwesome5 name="calendar-alt" size={30} color="black" />, route: 'HolidayPay' },
  { label: 'Service Incentive Leave', icon: <Ionicons name="calendar-outline" size={32} color="black" />, route: 'SIL' },
  { label: '13th Month Pay', icon: <MaterialIcons name="event-available" size={32} color="black" />, route: 'ThirteenthMonthPay' },
  { label: 'Retirement Pay', icon: <FontAwesome5 name="user-clock" size={30} color="#000" />, route: 'RetirementPay' },
];

const HomePage = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('loggedInUser');
      setIsLoggedIn(!!storedProfile);
    } catch (error) {
      console.error('Error checking login status:', error);
      setIsLoggedIn(false);
    }
  };

  const handleProfileIconPress = async () => {
    await checkAuthenticationStatus();
    navigation.navigate(isLoggedIn ? 'Admin' : 'Login');
  };

  const handleIconPress = (route) => {
    if (!route) {
      Alert.alert('Navigation not set for this computation type.');
    } else {
      navigation.navigate(route);
    }
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
          onPress={() => navigation.navigate('Landing')}
        />
        <Ionicons
          name="person-circle-outline"
          size={32}
          color="white"
          onPress={handleProfileIconPress}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>LABOR STANDARDS</Text>
        <Text style={styles.subtitle}>COMPUTATION</Text>

        <View style={styles.grid}>
          {iconButtons.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.iconButton}
              onPress={() => handleIconPress(item.route)}
            >
              {item.icon}
              <Text style={styles.iconLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');
const buttonSize = width / 3 - 30;

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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 40,
    marginBottom: 10,
  },
  content: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 20,
    color: '#B0B0B0',
    marginBottom: 30,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  iconButton: {
    width: buttonSize,
    height: buttonSize,
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    elevation: 5,
  },
  iconLabel: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    color: '#000',
  },
});

export default HomePage;
