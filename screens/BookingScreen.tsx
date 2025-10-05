import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Props = NativeStackScreenProps<RootStackParamList, 'Booking'>;

const BookingScreen: React.FC<Props> = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<Props['route']>();
  const { boatId, seats } = route.params;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentInfo, setPaymentInfo] = useState('');

  const handleBook = () => {
    navigation.navigate('Confirmation');
  };

  return (
    <ScrollView style={tw`flex-1 bg-blue-900 p-4`}>
      <Text style={tw`text-2xl font-bold text-blue-100 mb-4`}>Booking Details for Boat {boatId}</Text>
      <Text style={tw`text-blue-200 mb-4`}>Seats: {seats.join(', ')}</Text>
      <View style={tw`mb-4`}>
        <Text style={tw`text-blue-100 mb-2`}>Full Name</Text>
        <TextInput
          style={tw`bg-blue-800 text-blue-100 p-3 rounded`}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="rgba(255,255,255,0.5)"
        />
      </View>
      <View style={tw`mb-4`}>
        <Text style={tw`text-blue-100 mb-2`}>Email</Text>
        <TextInput
          style={tw`bg-blue-800 text-blue-100 p-3 rounded`}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          placeholderTextColor="rgba(255,255,255,0.5)"
        />
      </View>
      <View style={tw`mb-6`}>
        <Text style={tw`text-blue-100 mb-2`}>Payment Info (Card Number)</Text>
        <TextInput
          style={tw`bg-blue-800 text-blue-100 p-3 rounded`}
          value={paymentInfo}
          onChangeText={setPaymentInfo}
          placeholder="XXXX-XXXX-XXXX-XXXX"
          secureTextEntry
          placeholderTextColor="rgba(255,255,255,0.5)"
        />
      </View>
      <TouchableOpacity
        style={tw`bg-blue-500 p-4 rounded flex-row justify-center items-center`}
        onPress={handleBook}
      >
        <Ionicons name="checkmark" size={20} color="white" style={tw`mr-2`} />
        <Text style={tw`text-white font-bold`}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BookingScreen;