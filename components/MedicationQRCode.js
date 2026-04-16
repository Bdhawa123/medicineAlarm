import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import ViewShot, { captureRef } from 'react-native-view-shot';

const MedicationQRCode = ({ medication }) => {
  const viewShotRef = useRef();

  const handleDownloadQR = async () => {
    try {
      // Capture the labeled QR view
      const uri = await captureRef(viewShotRef, {
        format: "png",
        quality: 1.0,
      });

      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('Success', 'QR Code saved to your gallery!');
      } else {
        // Fallback to sharing if permission denied
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: `Share Medication QR: ${medication.name}`,
            UTI: 'public.png'
          });
        } else {
          Alert.alert('Error', 'Permission denied and sharing is not available.');
        }
      }
    } catch (error) {
      console.error("Error saving QR code:", error);
      Alert.alert('Error', 'Failed to save labeled QR code');
    }
  };

  const qrValue = medication.qrCode || `MED-${medication.id}`;

  return (
    <View>
      {/* Visible Selection Card */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Verification QR Code</Text>
        <View style={styles.qrCard}>
          <View style={styles.qrContainer}>
            <QRCode
              value={qrValue}
              size={140}
              backgroundColor="white"
            />
          </View>
          <View style={styles.qrInfo}>
            <Text style={styles.qrCodeText}>{qrValue}</Text>
            <Text style={styles.qrHint}>Use this code to verify when taking your medication.</Text>
            
            <TouchableOpacity style={styles.downloadBtn} onPress={handleDownloadQR}>
              <Ionicons name="download-outline" size={18} color="white" />
              <Text style={styles.downloadBtnText}>Download to Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Hidden ViewShot for Labeled Export */}
      <View style={{ position: 'absolute', left: -2000 }}>
        <ViewShot
          ref={viewShotRef}
          options={{ format: "png", quality: 1.0 }}
          style={styles.exportContainer}
        >
          <Text style={styles.exportTitle}>{medication.name}</Text>
          <QRCode
            value={qrValue}
            size={240}
            backgroundColor="white"
          />
          <Text style={styles.exportCode}>Code: {qrValue}</Text>
          <Text style={styles.exportFooter}>Medicine Alarm Verification</Text>
        </ViewShot>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  qrCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  qrInfo: {
    flex: 1,
    marginLeft: 15,
  },
  qrCodeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    letterSpacing: 1,
  },
  qrHint: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
    marginBottom: 12,
    lineHeight: 16,
  },
  downloadBtn: {
    backgroundColor: '#2196f3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  downloadBtnText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  /* Export Styles */
  exportContainer: {
    padding: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    width: 400,
  },
  exportTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
    textAlign: 'center',
  },
  exportCode: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  exportFooter: {
    marginTop: 10,
    fontSize: 12,
    color: '#999',
  },
});

export default MedicationQRCode;
