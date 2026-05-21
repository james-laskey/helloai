import React, { useState, useEffect, useRef } from 'react';
import { View, Modal, ActivityIndicator, Text, StyleSheet } from 'react-native';
import mobileAds, { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

// Use test ads during development
// const adUnitId = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-7771195501439294/5587441583';
const adUnitId = 'ca-app-pub-7771195501439294/5587441583';

export const InterstitialAdComponent = ({ visible, onClose, onAdComplete }) => {
  const [loading, setLoading] = useState(true);
  const interstitialRef = useRef(null);

  // Initialize Mobile Ads SDK once
  useEffect(() => {
    if (visible && !interstitialRef.current) {
      loadAndShowAd();
    }
  }, [visible]);

  const loadAndShowAd = async () => {
    try {
      setLoading(true);
      
      // Create interstitial ad
      const interstitial = InterstitialAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });
      interstitialRef.current = interstitial;

      // Add event listeners
      const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
        setLoading(false);
        interstitial.show();
      });

      const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        cleanup();
        if (onAdComplete) onAdComplete();
        if (onClose) onClose();
      });

      const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('Ad error:', error);
        cleanup();
        if (onAdComplete) onAdComplete();
        if (onClose) onClose();
      });

      // Load the ad
      interstitial.load();

      function cleanup() {
        unsubscribeLoaded();
        unsubscribeClosed();
        unsubscribeError();
        interstitialRef.current = null;
      }
      
    } catch (error) {
      console.error('Error loading ad:', error);
      setLoading(false);
      if (onAdComplete) onAdComplete();
      if (onClose) onClose();
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#53C691" />
            <Text style={styles.loadingText}>Loading ad...</Text>
          </View>
        )}
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
    fontSize: 16,
    marginTop: 12,
  },
});