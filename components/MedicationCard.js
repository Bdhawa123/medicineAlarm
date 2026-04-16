import React, { useState, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  UIManager,
  Animated,
  Alert
} from "react-native";
import CustomAlert from "../utils/CustomAlert";
import { MaterialIcons } from "@expo/vector-icons";
import { Context as MedicationContext } from "../context/MedicationContext";
import * as ImagePicker from 'expo-image-picker';
import RNQRGenerator from 'rn-qr-generator';

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MedicationCard = ({ item, index }) => {
  const {
    state: { medications }, deleteMedication, takeMedication
  } = useContext(MedicationContext);
  const med = medications.find((m) => m.id === item.id);

  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isTakeModalVisible, setTakeModalVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    setDeleteModalVisible(false);
    deleteMedication(med.id);
  };

  const handleTake = () => {
    setTakeModalVisible(true);
  };

  const confirmTake = () => {
    setTakeModalVisible(false);
    // Manual confirmation removed as per user request
    Alert.alert('Verification Required', 'Please use the QR verification to record this dose.');
  };

  const handleVerifyWithImage = async () => {
    try {
      // 1. Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need access to your gallery to verify the QR code.');
        return;
      }

      // 2. Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      setTakeModalVisible(false); // Close the choice modal

      // 3. Scan QR from image
      const imageUri = result.assets[0].uri;
      const response = await RNQRGenerator.detect({ uri: imageUri });

      const { values } = response;

      if (values && values.length > 0) {
        const detectedCode = values[0];
        const targetCode = med.qrCode || `MED-${med.id}`;

        if (detectedCode === targetCode) {
          // Success!
          takeMedication(med, { 
            method: "GALLERY", 
            source: "APP", 
            isVerified: true,
            capturedData: detectedCode
          });
          Alert.alert('Success', 'Medication verified and recorded!');
        } else {
          Alert.alert('Verification Failed', 'The QR code does not match this medication.');
        }
      } else {
        Alert.alert('No QR Code Found', 'We could not find a QR code in the selected image.');
      }
    } catch (error) {
      console.error("Verification error:", error);
      Alert.alert('Error', 'An error occurred during verification.');
    }
  };


  const toggleExpand = () => {
    if (expanded) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    setExpanded(!expanded);
  };

  const bodyHeight = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100], // Adjust 100 to fit your content
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.indexContainer}>
          <Text style={styles.indexText}>{index + 1}</Text>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{med.name}</Text>
          <Text style={styles.dosageText}>{med.dosage}</Text>
        </View>
        <TouchableOpacity onPress={toggleExpand} activeOpacity={0.8}>
          <MaterialIcons
            name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <Animated.View
        style={{ height: bodyHeight, opacity: opacity, overflow: "hidden" }}
      >
        <View style={styles.divider} />
        <Text style={styles.label}>INSTRUCTIONS</Text>
        <Text style={styles.descriptionText}>{med.instructions}</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity onPress={handleTake} style={styles.takeBtn}>
            <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
            <Text style={{ color: "#4CAF50", marginLeft: 5, fontWeight: "600" }}>Take Dose</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDelete} style={styles.deleteBtn}>
            <MaterialIcons name="delete" size={20} color="#FF5252" />
            <Text style={{ color: "#FF5252", marginLeft: 5 }}>Remove</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <CustomAlert
        visible={isDeleteModalVisible}
        title="Delete Medication"
        message={`Are you sure you want to delete ${med.name}? This will also cancel its alarm.`}
        cancelText="Cancel"
        confirmText="Delete"
        confirmColor="#E53935"
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={confirmDelete}
      />

      <CustomAlert
        visible={isTakeModalVisible}
        title="Verify Medication"
        message={`Verification is required to record ${med.name}. Please upload the medication's QR code image.`}
        cancelText="Cancel"
        secondaryConfirmText="Verify with QR Image"
        secondaryConfirmColor="#4CAF50"
        onCancel={() => setTakeModalVisible(false)}
        onSecondaryConfirm={handleVerifyWithImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: { flexDirection: "row", alignItems: "center" },
  indexContainer: {
    backgroundColor: "#e3f2fd",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  indexText: { color: "#2196f3", fontWeight: "bold" },
  nameContainer: { flex: 1 },
  nameText: { fontSize: 18, fontWeight: "700" },
  dosageText: { color: "#666" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  label: { fontSize: 10, fontWeight: "bold", color: "#aaa", marginBottom: 4 },
  descriptionText: { fontSize: 14, color: "#444" },
  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 15,
    gap: 15,
  },
  takeBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default MedicationCard;
