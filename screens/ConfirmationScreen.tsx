import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const handleBack = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={tw`flex-1 bg-blue-900 p-4 justify-center items-center`}>
      <Ionicons name="checkmark-circle" size={100} color="#3b82f6" />
      <Text style={tw`text-2xl font-bold text-blue-100 mt-4 mb-2`}>Booking Confirmed!</Text>
      <Text style={tw`text-blue-200 text-center mb-6`}>Your speed boat seats have been booked successfully. Check your email for details.</Text>
      <TouchableOpacity
        style={tw`bg-blue-500 p-4 rounded flex-row justify-center items-center`}
        onPress={handleBack}
      >
        <Ionicons name="home" size={20} color="white" style={tw`mr-2`} />
        <Text style={tw`text-white font-bold`}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ConfirmationScreen;