import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

const FAQSection: React.FC<{ faqItems: { question: string; answer: string }[] }> = ({ faqItems }) => {
  const [activeFaqItem, setActiveFaqItem] = useState<number | null>(null);

  const toggleFaqItem = (index: number) => {
    setActiveFaqItem(activeFaqItem === index ? null : index);
  };

  return (
    <View style={tw`py-10 px-4 bg-gradient-to-br from-blue-100 to-sky-100`}>
      <View style={tw`text-center mb-16`}>
        <Text style={tw`text-3xl font-bold text-gray-900 mb-6 text-center`}>
          Got <Text style={tw`text-[#0578A2]`}>Questions?</Text>
        </Text>
        <Text style={tw`text-lg text-gray-600 max-w-2xl mx-auto text-center`}>
          Find answers to common questions about our premium speed boat services and booking process.
        </Text>
      </View>

      <View style={tw`space-y-4`}>
        {faqItems.map((item, index) => (
          <View
            key={index}
            style={tw`bg-white rounded-2xl shadow-sm border border-blue-200 overflow-hidden ${
              activeFaqItem === index ? 'shadow-lg border-[#0578A2]/20' : ''
            }`}
          >
            <TouchableOpacity
              style={tw`w-full flex-row items-center justify-between p-6`}
              onPress={() => toggleFaqItem(index)}
              accessibilityRole="button"
              accessibilityState={{ expanded: activeFaqItem === index }}
            >
              <Text style={tw`font-semibold text-gray-900 text-lg pr-4`}>{item.question}</Text>
              <View
                style={tw`w-8 h-8 rounded-full flex items-center justify-center ${
                  activeFaqItem === index ? 'bg-[#0578A2]' : 'bg-blue-100'
                }`}
              >
                <Ionicons
                  name="chevron-down"
                  size={18}
                  color={activeFaqItem === index ? '#FFFFFF' : '#0578A2'}
                  style={tw`${activeFaqItem === index ? 'rotate-180' : ''}`}
                />
              </View>
            </TouchableOpacity>

            <View
              style={tw`overflow-hidden ${activeFaqItem === index ? 'max-h-96 pb-6' : 'max-h-0'}`}
            >
              <View style={tw`px-6 text-gray-600 leading-relaxed border-t border-blue-100 pt-4`}>
                <Text>{item.answer}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default FAQSection;