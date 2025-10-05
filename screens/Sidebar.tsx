// Sidebar.tsx
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

interface MenuItem {
  id: string;
  name: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
}

const menuItems: MenuItem[] = [
  { id: '1', name: 'Home', icon: 'home', label: 'Home' },
  { id: '2', name: 'Results', icon: 'search', label: 'Search Results' },
  { id: '3', name: 'SeatSelection', icon: 'car', label: 'Select Seats' },
  { id: '4', name: 'Booking', icon: 'calendar', label: 'My Bookings' },
  { id: '5', name: 'Confirmation', icon: 'checkmark-circle', label: 'Confirmations' },
];

const additionalMenuItems: { id: string; icon: React.ComponentProps<typeof Ionicons>['name']; label: string; name: string }[] = [
  { id: '6', icon: 'person', label: 'Profile', name: 'Profile' },
  { id: '7', icon: 'settings', label: 'Settings', name: 'Settings' },
  { id: '8', icon: 'help-circle', label: 'Help & Support', name: 'Help' },
  { id: '9', icon: 'information-circle', label: 'About', name: 'About' },
];

interface SidebarProps {
  navigation?: any;
  currentRoute?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ navigation, currentRoute = 'Home' }) => {
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const toggleSidebar = () => {
    const toValue = isOpen ? -SIDEBAR_WIDTH : 0;
    const overlayValue = isOpen ? 0 : 1;

    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }),
      Animated.timing(overlayAnim, {
        toValue: overlayValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    setIsOpen(!isOpen);
  };

  const handleMenuPress = (routeName: string) => {
    toggleSidebar();
    if (navigation) {
      navigation.navigate(routeName);
    }
  };

  return (
    <>
  {/* Header with Menu Button */}
  <View style={[styles.header, { paddingTop: Math.max(12 + insets.top, 16) }]}>
        <TouchableOpacity
          onPress={toggleSidebar}
          style={styles.menuButton}
          activeOpacity={0.7}
        >
          <Ionicons name="menu" size={28} color="#1F2937" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { marginLeft: -149 }]}>Dream Speed</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Overlay */}
      {isOpen && (
        <Animated.View
          style={[
            styles.overlay,
            { opacity: overlayAnim },
          ]}
        >
          <TouchableOpacity
            style={styles.overlayTouchable}
            activeOpacity={1}
            onPress={toggleSidebar}
          />
        </Animated.View>
      )}

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          { transform: [{ translateX: slideAnim }] },
        ]}
      >
        <ScrollView style={styles.sidebarContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            onPress={toggleSidebar}
            style={[styles.closeButton, { top: Math.max(insets.top, 12), right: 12 }]}
            accessibilityLabel="Close sidebar"
            accessibilityRole="button"
          >
            <Ionicons name="close" size={22} color="#374151" />
          </TouchableOpacity>
          {/* Profile Section */}
          <View style={[styles.profileSection, { paddingTop: Math.max(12 + insets.top, 24) }]}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color="#3B82F6" />
              </View>
            </View>
            <Text style={styles.userName}>John Doe</Text>
            <Text style={styles.userEmail}>john.doe@example.com</Text>
          </View>

          {/* Main Menu Items */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>NAVIGATION</Text>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  currentRoute === item.name && styles.menuItemActive,
                ]}
                onPress={() => handleMenuPress(item.name)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.menuIconContainer,
                  currentRoute === item.name && styles.menuIconContainerActive,
                ]}>
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={currentRoute === item.name ? '#3B82F6' : '#6B7280'}
                  />
                </View>
                <Text style={[
                  styles.menuLabel,
                  currentRoute === item.name && styles.menuLabelActive,
                ]}>
                  {item.label}
                </Text>
                {currentRoute === item.name && (
                  <View style={styles.activeIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Additional Menu Items */}
          <View style={styles.menuSection}>
            <Text style={styles.sectionTitle}>MORE</Text>
            {additionalMenuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item.name)}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon} size={22} color="#6B7280" />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  menuButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 0.3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  sidebarContent: {
    flex: 1,
  },
  profileSection: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#DBEAFE',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  menuSection: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: '#EFF6FF',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuIconContainerActive: {
    backgroundColor: '#DBEAFE',
  },
  menuLabel: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
    flex: 1,
  },
  menuLabelActive: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  activeIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#3B82F6',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 8,
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 12,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  closeButton: {
    position: 'absolute',
    zIndex: 1100,
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 8,
  },
});

export default Sidebar;