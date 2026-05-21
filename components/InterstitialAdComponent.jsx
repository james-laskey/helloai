// components/InterstitialAdComponent.js

import React, { useState, useEffect, useRef } from 'react';
import { View, Modal, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

// Use test IDs during development, replace with real IDs for production
const AD_UNIT_ID = __DEV__ 
  ? TestIds.INTERSTITIAL
  : 'ca-app-pub-xxxxxxxxxxxxxxxx/yyyyyyyyyy'; // Replace with your real Interstitial Ad Unit ID

export const InterstitialAdComponent = ({ visible, onClose, onAdComplete }) => {
  const [loading, setLoading] = useState(true);
  const [canSkip, setCanSkip] = useState(false);
  const interstitialRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (visible) {
      loadAndShowAd();
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [visible]);

  const loadAndShowAd = async () => {
    setLoading(true);
    setCanSkip(false);
    
    // Create interstitial ad instance
    const interstitial = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: true,
    });
    interstitialRef.current = interstitial;

    // Set up event listeners
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      setLoading(false);
      interstitial.show();
      
      // Start 5-second timer for skip button
      timerRef.current = setTimeout(() => {
        setCanSkip(true);
      }, 5000);
    });

    const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (onAdComplete) {
        onAdComplete();
      }
      onClose();
    });

    const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('Ad error:', error);
      setLoading(false);
      // If ad fails to load, just close and continue
      if (onAdComplete) {
        onAdComplete();
      }
      onClose();
    });

    // Load the ad
    interstitial.load();

    // Cleanup listeners when ad is done
    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  };

  // Manual close handler (only available after 5 seconds)
  const handleManualClose = () => {
    if (canSkip && interstitialRef.current) {
      interstitialRef.current.close();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => {
        if (canSkip) {
          onClose();
        }
      }}
    >
      <View style={styles.modalContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#53C691" />
            <Text style={styles.loadingText}>Loading ad...</Text>
          </View>
        ) : null}
        
        {/* Optional: Custom skip button overlay */}
        {!loading && canSkip && (
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={handleManualClose}
          >
            <Text style={styles.skipButtonText}>Skip Ad ›</Text>
          </TouchableOpacity>
        )}
        
        {/* Optional: Timer indicator */}
        {!loading && !canSkip && (
          <View style={styles.timerIndicator}>
            <Text style={styles.timerText}>Ad closes in 5s</Text>
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
    fontSize: 18,
    marginTop: 20,
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  skipButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  timerIndicator: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  timerText: {
    color: '#aaa',
    fontSize: 12,
  },
});