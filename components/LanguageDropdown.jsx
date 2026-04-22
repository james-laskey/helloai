import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { LANGUAGE_TOPICS } from '../constants/languageTopics';

export const LanguageDropdown = ({ selectedLanguage, onSelectLanguage }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setMenuVisible(true)}>
        <Text style={styles.dropdownButtonText}>{LANGUAGE_TOPICS[selectedLanguage]?.icon || '🌐'} {selectedLanguage}</Text>
        <Ionicons name="chevron-down" size={18} color="#fff" />
      </TouchableOpacity>
      
      <Modal visible={menuVisible} transparent={true} animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <View style={styles.dropdownMenu}>
            {Object.keys(LANGUAGE_TOPICS).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.dropdownItem, selectedLanguage === lang && styles.dropdownItemSelected]}
                onPress={() => {
                  onSelectLanguage(lang);
                  setMenuVisible(false);
                }}
              >
                <Text style={styles.dropdownItemIcon}>{LANGUAGE_TOPICS[lang].icon}</Text>
                <Text style={[styles.dropdownItemText, selectedLanguage === lang && styles.dropdownItemTextSelected]}>{lang}</Text>
                {selectedLanguage === lang && <Ionicons name="checkmark" size={18} color="#007AFF" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: { position: 'relative', zIndex: 10 },
  dropdownButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 30, gap: 8 },
  dropdownButtonText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-start', paddingTop: 60 },
  dropdownMenu: { backgroundColor: '#1a1a1a', marginHorizontal: 16, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#333' },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  dropdownItemSelected: { backgroundColor: '#2a2a3e' },
  dropdownItemIcon: { fontSize: 20 },
  dropdownItemText: { flex: 1, color: '#fff', fontSize: 16 },
  dropdownItemTextSelected: { color: '#007AFF', fontWeight: '600' }
});