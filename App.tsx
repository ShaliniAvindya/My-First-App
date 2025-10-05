import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import tw from 'twrnc';
import HomeScreen from './screens/HomeScreen';
import ResultsScreen from './screens/ResultsScreen';
import SeatSelectionScreen from './screens/SeatSelectionScreen';
import BookingScreen from './screens/BookingScreen';
import ConfirmationScreen from './screens/ConfirmationScreen';
import Sidebar from './screens/Sidebar';
import { RootStackParamList } from './types/navigation';

const Tab = createBottomTabNavigator<RootStackParamList>();

// Wrapper component that adds Sidebar to each screen
const ScreenWrapper = ({ 
  Component, 
  navigation, 
  route 
}: { 
  Component: React.ComponentType<any>;
  navigation: any;
  route: any;
}) => {
  return (
    <>
      <Sidebar navigation={navigation} currentRoute={route.name} />
      <Component navigation={navigation} route={route} />
    </>
  );
};

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        sceneContainerStyle={{ paddingBottom: 65 }}
        screenOptions={({ route }: { route: import('@react-navigation/native').RouteProp<RootStackParamList, keyof RootStackParamList> }) => ({
          headerShown: false,
          tabBarStyle: [
            tw`bg-white border-0 shadow-2xl`,
            {
              position: 'absolute',
              height: 65,
              elevation: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.15,
              shadowRadius: 20,
            }
          ],
          tabBarActiveTintColor: '#3B82F6',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarShowLabel: false,
          tabBarItemStyle: {
            paddingVertical: 5,
          },
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => {
            let iconName: React.ComponentProps<typeof Ionicons>['name'];
            
            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Results':
                iconName = focused ? 'search' : 'search-outline';
                break;
              case 'SeatSelection':
                iconName = focused ? 'car' : 'car-outline';
                break;
              case 'Booking':
                iconName = focused ? 'calendar' : 'calendar-outline';
                break;
              case 'Confirmation':
                iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
                break;
              default:
                iconName = 'ellipse-outline';
            }
            
            return (
              <View style={[
                tw`items-center justify-center`,
                focused && tw`bg-blue-50 rounded-2xl px-6 py-2`,
                { minWidth: 50 }
              ]}>
                <Ionicons 
                  name={iconName} 
                  size={focused ? 26 : 24} 
                  color={color}
                  style={tw`${focused ? 'mb-0' : 'mb-0'}`}
                />
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Home">
          {(props) => <ScreenWrapper Component={HomeScreen} {...props} />}
        </Tab.Screen>
        <Tab.Screen name="Results">
          {(props) => <ScreenWrapper Component={ResultsScreen} {...props} />}
        </Tab.Screen>
        <Tab.Screen name="SeatSelection">
          {(props) => <ScreenWrapper Component={SeatSelectionScreen} {...props} />}
        </Tab.Screen>
        <Tab.Screen name="Booking">
          {(props) => <ScreenWrapper Component={BookingScreen} {...props} />}
        </Tab.Screen>
        <Tab.Screen name="Confirmation">
          {(props) => <ScreenWrapper Component={ConfirmationScreen} {...props} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;