import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';

export const StatsModal = ({ visible, onClose, userStats }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>📊 Your Learning Stats</Text>
          
          {userStats?.languages?.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statLanguage}>{stat.language} {stat.topic && `- ${stat.topic}`}</Text>
              <View style={styles.statRow}>
                <Ionicons name="time-outline" size={20} color="#007AFF" />
                <Text style={styles.statText}>Total: {Math.floor(stat.total_duration_seconds / 60)} minutes</Text>
              </View>
              <View style={styles.statRow}>
                <Ionicons name="chatbubbles-outline" size={20} color="#007AFF" />
                <Text style={styles.statText}>Messages: {stat.total_messages}</Text>
              </View>
              <View style={styles.statRow}>
                <Ionicons name="calendar-outline" size={20} color="#007AFF" />
                <Text style={styles.statText}>Last: {new Date(stat.last_practiced).toLocaleDateString()}</Text>
              </View>
            </View>
          ))}
          
          {(!userStats?.languages || userStats.languages.length === 0) && (
            <Text style={styles.noStats}>No sessions yet. Start practicing!</Text>
          )}
          
          <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
            <Text style={styles.closeModalText}>Continue Learning</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#1a1a1a', borderRadius: 30, padding: 24, width: '90%', maxHeight: '80%' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  statCard: { backgroundColor: '#2a2a2a', borderRadius: 16, padding: 16, marginBottom: 12 },
  statLanguage: { fontSize: 18, fontWeight: 'bold', color: '#007AFF', marginBottom: 8 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  statText: { color: '#fff', fontSize: 14 },
  noStats: { color: '#888', textAlign: 'center', fontSize: 16, marginVertical: 20 },
  closeModalButton: { backgroundColor: '#007AFF', borderRadius: 16, padding: 16, marginTop: 20 },
  closeModalText: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' }
});