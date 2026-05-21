// components/RewardedAdComponent.js

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { RewardedAd, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';

// Use test IDs during development, replace with real IDs for production
const AD_UNIT_ID = __DEV__ 
  ? TestIds.REWARDED
  : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy'; // Replace with your real Ad Unit ID

export const RewardedAdComponent = ({ 
  visible, 
  onClose, 
  onRewardEarned,
  onAdComplete 
}) => {
  const [loading, setLoading] = useState(true);
  const [rewardAmount, setRewardAmount] = useState(0);
  const rewardedAdRef = useRef(null);

  useEffect(() => {
    if (visible) {
      loadAndShowAd();
    }
  }, [visible]);

  const loadAndShowAd = async () => {
    setLoading(true);
    
    // Create rewarded ad instance
    const rewardedAd = RewardedAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });
    rewardedAdRef.current = rewardedAd;

    // Set up event listeners
    const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoading(false);
      rewardedAd.show();
    });

    const unsubscribeEarned = rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
      console.log('User earned reward:', reward);
      setRewardAmount(reward.amount);
      if (onRewardEarned) {
        onRewardEarned(reward);
      }
    });

    const unsubscribeClosed = rewardedAd.addAdEventListener(RewardedAdEventType.CLOSED, () => {
      // Ad was closed by user after watching (reward may or may not be earned)
      if (onAdComplete) {
        onAdComplete(rewardAmount > 0);
      }
      onClose();
    });

    // Load the ad
    rewardedAd.load();

    // Cleanup listeners when ad is done
    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
    };
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#53C691" />
            <Text style={styles.loadingText}>Loading ad...</Text>
            <Text style={styles.loadingSubtext}>
              Ad plays for up to 30 seconds. You'll receive a reward for watching.
            </Text>
          </View>
        ) : null}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
  },
  loadingSubtext: {
    color: '#888',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});