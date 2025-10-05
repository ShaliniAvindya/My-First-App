import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const dummyBoats = [
  { id: '1', name: 'Speedy Maldives 1', time: '10:00 AM', duration: '30 min', price: '$50' },
  { id: '2', name: 'Ocean Rider', time: '12:00 PM', duration: '45 min', price: '$60' },
  { id: '3', name: 'Blue Wave Express', time: '2:00 PM', duration: '40 min', price: '$55' },
];

const ResultsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const renderBoat = ({ item }: { item: typeof dummyBoats[0] }) => (
    <TouchableOpacity
      style={tw`bg-blue-800 p-4 mb-4 rounded`}
      onPress={() => navigation.navigate('SeatSelection', { boatId: item.id })}
    >
      <Text style={tw`text-blue-100 font-bold`}>{item.name}</Text>
      <Text style={tw`text-blue-200`}>Departure: {item.time}</Text>
      <Text style={tw`text-blue-200`}>Duration: {item.duration}</Text>
      <Text style={tw`text-blue-200`}>Price per seat: {item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-blue-900 p-4`}>
      <Text style={tw`text-2xl font-bold text-blue-100 mb-4`}>Available Speed Boats</Text>
      <FlatList
        data={dummyBoats}
        renderItem={renderBoat}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default ResultsScreen;