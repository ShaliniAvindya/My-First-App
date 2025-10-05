import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, FlatList, Linking, Modal, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import tw from 'twrnc';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import FAQSection from './FAQSection';
import { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Sample data (replacing backend fetches)
const locations = [
  { id: '1', name: 'Male', label: 'Male' },
  { id: '2', name: 'Maafushi', label: 'Maafushi' },
  { id: '3', name: 'Hulhumale', label: 'Hulhumale' },
];

const nationalityOptions = [
  { id: 'local', label: '🇲🇻 Local (Maldivian)' },
  { id: 'foreigner', label: '🌍 Foreigner' },
];

const heroSlides = [
  {
    media: 'https://i.postimg.cc/wTtsbfmg/photo-1673199577774-ff2dedf2f11f.avif',
    title: 'Discover Paradise',
    subtitle: 'Embark on extraordinary adventures across the pristine waters of the Maldives',
  },
];

const aboutContent: {
  title: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  content: string;
}[] = [
  {
    title: 'Our Mission',
    icon: 'information-circle',
    content: 'Dream Speed revolutionizes inter-island transportation in the Maldives with cutting-edge technology and authentic hospitality.',
  },
  {
    title: 'Our Promise',
    icon: 'boat',
    content: 'We deliver premium speed boat experiences with state-of-the-art vessels, expert crews, and intelligent booking systems.',
  },
];

// Sample FAQ data
const faqItems = [
  {
    question: 'How early should I arrive at the departure point?',
    answer: 'Please arrive 20-30 minutes before departure to complete check-in procedures. This ensures a smooth boarding experience and allows time for any last-minute assistance you might need.',
  },
  {
    question: "What's your flexible cancellation policy?",
    answer: 'Free cancellation up to 24 hours before departure with full refund. Cancellations between 24-2 hours receive 75% refund. Within 2 hours of departure, 50% refund applies.',
  },
  {
    question: 'What luggage allowance is included?',
    answer: 'Each ticket includes one checked bag (25kg) and one carry-on (8kg). Additional luggage can be arranged during booking or at departure, subject to vessel capacity.',
  },
  {
    question: 'Are your vessels family-friendly and accessible?',
    answer: 'Absolutely! Our modern fleet features safety equipment for all ages, including infant life jackets. We accommodate elderly passengers and those with mobility needs - just inform us during booking.',
  },
];

// Custom Dropdown Component
const CustomDropdown: React.FC<{
  options: { id: string; label: string; name?: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
}> = ({ options, selectedValue, onValueChange, placeholder, label, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.id === selectedValue);

  return (
    <View>
      <Text style={tw`text-base font-semibold text-gray-800 mb-2 flex-row items-center`}>
        <Ionicons name={icon} size={18} color="#0578A2" style={tw`mr-2`} />
        {label} <Text style={tw`text-[#0578A2]`}>*</Text>
      </Text>
      <TouchableOpacity
        style={tw`bg-blue-50 border-2 border-blue-200 rounded-xl p-3 flex-row items-center`}
        onPress={() => setIsOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        <Text style={tw`flex-1 text-base ${selectedValue ? 'text-gray-800' : 'text-gray-500'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#0578A2" />
      </TouchableOpacity>
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={tw`flex-1 bg-black/60 justify-center items-center px-4`}>
            <TouchableWithoutFeedback>
              <View style={tw`bg-white rounded-2xl p-4 border border-blue-200 shadow-lg w-full max-w-xs`}>
                <View style={tw`flex-row justify-between items-center mb-4`}>
                  <Text style={tw`text-lg font-bold text-[#0578A2]`}>{label}</Text>
                  <TouchableOpacity onPress={() => setIsOpen(false)}>
                    <Ionicons name="close" size={20} color="gray" />
                  </TouchableOpacity>
                </View>
                <ScrollView style={tw`max-h-64`}>
                  {options.map((option) => (
                    <TouchableOpacity
                      key={option.id}
                      style={tw`p-3 border-b border-blue-100 ${selectedValue === option.id ? 'bg-blue-50' : ''}`}
                      onPress={() => {
                        onValueChange(option.id);
                        setIsOpen(false);
                      }}
                    >
                      <Text style={tw`text-base text-gray-800`}>{option.label || option.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isForeigner, setIsForeigner] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());

  // Preload images
  useEffect(() => {
    heroSlides.forEach((slide) => {
      Image.prefetch(slide.media).catch((error) => console.log('Prefetch error:', slide.media, error));
    });
  }, []);

  const handleSearch = () => {
    if (!selectedFrom || !selectedTo || !selectedDate) {
      setErrorMessage('Please fill in all required search fields.');
      return;
    }
    navigation.navigate('Results');
  };

  const closeErrorModal = () => {
    setErrorMessage('');
  };

  const scrollToSearch = () => {
    scrollViewRef.current?.scrollTo({ y: 500, animated: true });
  };

  // Format date using local time to avoid UTC shifts
  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const renderSlide = ({ item, index }: { item: typeof heroSlides[0]; index: number }) => (
    <View
      style={tw`w-full h-[500px] absolute inset-0 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
    >
      <Image
        source={{ uri: item.media, cache: 'force-cache' }}
        style={tw`w-full h-full object-cover`}
        resizeMode="cover"
        onError={(error) => console.log('Image error:', item.media, error.nativeEvent.error)}
      />
      <LinearGradient
        colors={[`rgba(154, 173, 224, 0.18)`, `rgba(31, 86, 236, 0.34)`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 500 }}
        pointerEvents="none"
      />
    </View>
  );

  return (
    <ScrollView style={tw`flex-1 bg-blue-50`} ref={scrollViewRef}>
      {/* Hero Section */}
      <LinearGradient
        // left-to-right gradient: white -> blue-100
        colors={['#ffffff', '#bfdbfe']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={tw`relative h-[350px] w-full`}
      >
        <FlatList
          data={heroSlides}
          renderItem={renderSlide}
          keyExtractor={(item, index) => index.toString()}
          style={tw`absolute inset-0 z-0`}
        />
        <View style={tw`absolute top-16 left-4 right-4 z-10`}>
          <Text style={tw`text-4xl font-bold text-white mb-6`}>{heroSlides[currentSlide].title}</Text>
          <Text style={tw`text-lg text-blue-100 mb-8 max-w-[80%]`}>{heroSlides[currentSlide].subtitle}</Text>
          <View style={tw`flex-row gap-4`}>
            <TouchableOpacity
              style={tw`bg-white px-6 py-3 rounded-full flex-row items-center`}
              onPress={scrollToSearch}
            >
              <Ionicons name="search" size={20} color="#0578A2" style={tw`mr-2`} />
              <Text style={tw`text-[#0578A2] font-bold`}>Book Your Journey</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`border-2 border-white px-6 py-3 rounded-full flex-row items-center`}
              onPress={() => Linking.openURL('https://m.followme.mv/public/?s=dream%20spee')}
            >
              <Ionicons name="location" size={20} color="white" style={tw`mr-2`} />
              <Text style={tw`text-white font-medium`}>Follow Boat</Text>
            </TouchableOpacity>
          </View>
        </View>
  </LinearGradient>

      {/* Search Section */}
      <View style={tw`py-10 px-4 bg-sky-100`}>
        <Text style={tw`text-3xl font-bold text-gray-900 mb-2 text-center`}>Find Your Perfect Route</Text>
        <Text style={tw`text-lg text-gray-600 mb-6 text-center`}>Search and book your speed boat journey in seconds</Text>
        <View style={tw`bg-white rounded-2xl p-6 shadow-lg border border-blue-200`}>
          <View style={tw`flex-col gap-4`}>
            {/* From */}
            <CustomDropdown
              options={locations}
              selectedValue={selectedFrom}
              onValueChange={setSelectedFrom}
              placeholder="Choose departure"
              label="From"
              icon="location"
            />
            {/* To */}
            <CustomDropdown
              options={locations}
              selectedValue={selectedTo}
              onValueChange={setSelectedTo}
              placeholder="Choose destination"
              label="To"
              icon="arrow-forward"
            />
            {/* Date */}
            <View>
              <Text style={tw`text-base font-semibold text-gray-800 mb-2 flex-row items-center`}>
                <Ionicons name="calendar" size={18} color="#0578A2" style={tw`mr-2`} />
                Date <Text style={tw`text-[#0578A2]`}>*</Text>
              </Text>
              <TouchableOpacity
                style={tw`bg-blue-50 border-2 border-blue-200 rounded-xl p-3 text-base flex-row items-center`}
                onPress={() => setOpenDatePicker(true)}
              >
                <Text style={tw`flex-1 text-base ${selectedDate ? 'text-gray-800' : 'text-gray-500'}`}>
                  {selectedDate ? formatDate(selectedDate) : 'Select a date'}
                </Text>
                <Ionicons name="calendar" size={18} color="#0578A2" />
              </TouchableOpacity>
              {/* Custom Calendar Modal */}
              <Modal
                visible={openDatePicker}
                transparent
                animationType="fade"
                onRequestClose={() => setOpenDatePicker(false)}
              >
                <TouchableWithoutFeedback onPress={() => setOpenDatePicker(false)}>
                  <View style={tw`flex-1 bg-black/60 justify-center items-center px-4`}>
                    <TouchableWithoutFeedback onPress={() => {}}>
                      <View style={tw`bg-white rounded-2xl p-4 border border-blue-200 shadow-lg w-full max-w-xs`}>
                        <View style={tw`flex-row justify-between items-center mb-2`}>
                      <TouchableOpacity
                        onPress={() => {
                          if (calendarMonth === 0) {
                            setCalendarMonth(11);
                            setCalendarYear(calendarYear - 1);
                          } else {
                            setCalendarMonth(calendarMonth - 1);
                          }
                        }}
                      >
                        <Ionicons name="chevron-back" size={24} color="#0578A2" />
                      </TouchableOpacity>
                      <Text style={tw`text-lg font-bold text-[#0578A2]`}>
                        {new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          if (calendarMonth === 11) {
                            setCalendarMonth(0);
                            setCalendarYear(calendarYear + 1);
                          } else {
                            setCalendarMonth(calendarMonth + 1);
                          }
                        }}
                      >
                        <Ionicons name="chevron-forward" size={24} color="#0578A2" />
                      </TouchableOpacity>
                    </View>
                    <View style={tw`flex-row justify-between mb-2`}>
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                        <Text key={d} style={tw`w-8 text-center text-xs text-gray-500`}>{d}</Text>
                      ))}
                    </View>
                    <View style={tw`flex-wrap flex-row justify-between`}>
                      {(() => {
                        const days: JSX.Element[] = [];
                        const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
                        const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
                        for (let i = 0; i < firstDay; i++) {
                          days.push(<View key={`empty-${i}`} style={tw`w-8 h-8`} />);
                        }
                        for (let d = 1; d <= daysInMonth; d++) {
                          const dateObj = new Date(calendarYear, calendarMonth, d);
                          const isPast = dateObj < new Date(new Date().setHours(0, 0, 0, 0));
                          days.push(
                            <TouchableOpacity
                              key={d}
                              style={tw`w-8 h-8 rounded-full items-center justify-center mb-2 ${selectedDate && dateObj.toDateString() === selectedDate.toDateString() ? 'bg-blue-200' : ''}`}
                              disabled={isPast}
                              onPress={() => {
                                setSelectedDate(dateObj);
                                setOpenDatePicker(false);
                              }}
                            >
                              <Text style={tw`${isPast ? 'text-gray-300' : 'text-gray-800'} text-sm`}>{d}</Text>
                            </TouchableOpacity>
                          );
                        }
                        return days;
                      })()}
                    </View>
                    <TouchableOpacity
                      style={tw`mt-2 bg-blue-100 p-2 rounded-xl`}
                      onPress={() => setOpenDatePicker(false)}
                    >
                      <Text style={tw`text-[#0578A2] text-center font-bold`}>Cancel</Text>
                    </TouchableOpacity>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </View>
            {/* Nationality */}
            <CustomDropdown
              options={nationalityOptions}
              selectedValue={isForeigner ? 'foreigner' : 'local'}
              onValueChange={(value) => setIsForeigner(value === 'foreigner')}
              placeholder="Select nationality"
              label="Nationality"
              icon="globe"
            />
            <TouchableOpacity
              style={tw`bg-blue-100 p-4 rounded-xl flex-row justify-center items-center`}
              onPress={handleSearch}
              activeOpacity={0.8}
            >
              <Ionicons name="search" size={22} color="#0578A2" style={tw`mr-2`} />
              <Text style={tw`text-[#0578A2] font-bold text-base`}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Error Modal */}
      {errorMessage && (
        <View style={tw`absolute inset-0 bg-black/60 justify-center items-center z-50`}>
          <View style={tw`bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-lg`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <View style={tw`flex-row items-center`}>
                <Ionicons name="alert-circle" size={24} color="#0578A2" style={tw`mr-2`} />
                <Text style={tw`text-lg font-semibold text-gray-900`}>Notice</Text>
              </View>
              <TouchableOpacity onPress={closeErrorModal}>
                <Ionicons name="close" size={20} color="gray" />
              </TouchableOpacity>
            </View>
            <Text style={tw`text-gray-700 mb-6`}>{errorMessage}</Text>
            <TouchableOpacity
              style={tw`bg-blue-600 p-2.5 rounded-lg`}
              onPress={closeErrorModal}
            >
              <Text style={tw`text-white font-medium text-center`}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* About Section */}
      <View style={tw`py-10 px-4 bg-sky-50`}>
        <Text style={tw`text-3xl font-bold text-gray-900 mb-4 text-center`}>
          About <Text style={tw`text-[#0578A2]`}>Dream Speed</Text>
        </Text>
        <Text style={tw`text-lg text-gray-600 mb-6 text-center`}>Experience luxury speed boat transportation across the Maldives.</Text>
        <View style={tw`space-y-8`}>
          {aboutContent.map((item, index) => (
            <View
              key={index}
              style={tw`${index < aboutContent.length - 1 ? 'mb-4' : ''} bg-white rounded-2xl p-6 border border-blue-200 shadow-sm`}
            >
              <View style={tw`flex-row items-start`}>
                <View style={tw`p-3 rounded-xl bg-blue-50 mr-4`}>
                  <Ionicons name={item.icon} size={24} color="#0578A2" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-xl font-bold text-gray-900 mb-2`}>{item.title}</Text>
                  <Text style={tw`text-gray-600`}>{item.content}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      <FAQSection faqItems={faqItems} />

      {/* CTA Section */}
      <View style={tw`py-8 px-4 bg-sky-100`}>
        <Text style={tw`text-3xl font-bold text-gray-900 mb-4 text-center`}>
            Journey <Text style={tw`text-[#0578A2]`}>Starts Here</Text>
        </Text>
        <View style={tw`items-center`}>
          <Text style={tw`text-lg text-gray-800 mb-8 max-w-2xl text-center py-4`}>Join thousands of travelers exploring the Maldives with our premium speed boat services.</Text>
        </View>
          <TouchableOpacity
            style={tw`bg-white px-6 py-3 rounded-2xl flex-row items-center justify-center mx-auto`}
            onPress={() => navigation.navigate('Results')}
          >
            <Ionicons name="call" size={20} color="#0578A2" style={tw`mr-2`} />
            <Text style={tw`text-[#0578A2] font-bold`}>Get Help</Text>
          </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;