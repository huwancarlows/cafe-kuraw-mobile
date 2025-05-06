import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Ionicons,
  FontAwesome5,
  MaterialIcons,
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const iconButtons = [
  { label: 'Minimum Wage', icon: 'hand-holding-usd', lib: FontAwesome5, route: 'MinimumWage' },
  { label: 'Nightshift Differential', icon: 'moon', lib: Ionicons, route: 'NightShiftDiff' },
  { label: 'Separation Pay', icon: 'logout', lib: MaterialIcons, route: 'SeparationPay' },
  { label: 'Overtime Pay', icon: 'clock', lib: FontAwesome5, route: 'OvertimePay' },
  { label: 'Premium Pay', icon: 'crown', lib: FontAwesome5, route: 'PremiumPay' },
  { label: 'Holiday Pay', icon: 'calendar-alt', lib: FontAwesome5, route: 'HolidayPay' },
  { label: 'Service Incentive Leave', icon: 'calendar-outline', lib: Ionicons, route: 'SIL' },
  { label: '13th Month Pay', icon: 'event-available', lib: MaterialIcons, route: 'ThirteenthMonthPay' },
  { label: 'Retirement Pay', icon: 'user-clock', lib: FontAwesome5, route: 'RetirementPay' },
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
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />

      <View style={styles.header}>
        <Ionicons
          name="arrow-back-outline"
          size={32}
          color="white"
          style={styles.headerIcon}
          onPress={() => navigation.navigate('Landing')}
        />
        <Ionicons
          name="person-circle-outline"
          size={32}
          color="white"
          style={styles.headerIcon}
          onPress={handleProfileIconPress}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>LABOR STANDARDS</Text>
        <Text style={styles.subtitle}>COMPUTATION</Text>

        <View style={styles.grid}>
          {iconButtons.map((item, index) => {
            const IconComponent = item.lib;
            return (
              <TouchableOpacity
                key={index}
                style={styles.iconButton}
                onPress={() => handleIconPress(item.route)}
                activeOpacity={0.8}
              >
                <View style={styles.iconCircle}>
                  <IconComponent name={item.icon} size={26} color="#222" />
                </View>
                <Text style={styles.iconLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
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
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 80,
  },
  headerIcon: {
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  content: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginTop:40,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#aaa',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom:60,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  iconButton: {
    width: buttonSize,
    height: buttonSize + 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    transitionDuration: '150ms',
  },
  iconCircle: {
    width: 52,
    height: 52,
    backgroundColor: '#FFD700',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconLabel: {
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
    color: '#333',
  },
});

export default HomePage;
