import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import tw from 'twrnc';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type Props = NativeStackScreenProps<RootStackParamList, 'SeatSelection'>;

const seats = Array.from({ length: 20 }, (_, i) => ({ id: `${i + 1}`, available: i % 3 !== 0 }));

const SeatSelectionScreen: React.FC<Props> = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<Props['route']>();
  const { boatId } = route.params;
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const toggleSeat = (id: string) => {
    if (selectedSeats.includes(id)) {
      setSelectedSeats(selectedSeats.filter(s => s !== id));
    } else {
      setSelectedSeats([...selectedSeats, id]);
    }
  };

  const handleProceed = () => {
    if (selectedSeats.length > 0) {
      navigation.navigate('Booking', { boatId, seats: selectedSeats });
    }
  };

  const renderSeat = ({ item }: { item: typeof seats[0] }) => (
    <TouchableOpacity
      style={tw`w-10 h-10 m-1 rounded ${item.available ? (selectedSeats.includes(item.id) ? 'bg-blue-500' : 'bg-blue-700') : 'bg-gray-500'}`}
      disabled={!item.available}
      onPress={() => toggleSeat(item.id)}
    >
      <Text style={tw`text-center text-white pt-2`}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-blue-900 p-4`}>
      <Text style={tw`text-2xl font-bold text-blue-100 mb-4`}>Select Seats for Boat {boatId}</Text>
      <FlatList
        data={seats}
        renderItem={renderSeat}
        keyExtractor={item => item.id}
        numColumns={5}
        extraData={selectedSeats}
      />
      <Text style={tw`text-blue-100 mt-4`}>Selected: {selectedSeats.join(', ')}</Text>
      <TouchableOpacity
        style={tw`bg-blue-500 p-4 rounded mt-6 flex-row justify-center items-center`}
        onPress={handleProceed}
      >
        <Ionicons name="arrow-forward" size={20} color="white" style={tw`mr-2`} />
        <Text style={tw`text-white font-bold`}>Proceed to Booking</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SeatSelectionScreen;