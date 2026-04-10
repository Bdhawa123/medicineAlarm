import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import CriticalToggle from "../utils/CriticalToggle";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

const MedicationEditScreen = ({ route, navigation }) => {
  const { med } = route.params;

  // Initialize local state with the existing medication data
  const [form, setForm] = useState({ ...med });

  // Helper to update nested objects
  const updateNested = (category, key, value) => {
    setForm((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    // In a real app, you'd trigger a DB update here
    console.log("Saving Data:", form);
    Alert.alert("Success", "Medication updated successfully!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit {med.name}</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveBtn}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Basic Info */}
        <Text style={styles.sectionLabel}>BASIC INFO</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={form.name}
          onChangeText={(val) => setForm({ ...form, name: val })}
        />
        <TextInput
          style={styles.input}
          placeholder="Dosage (e.g. 500mg)"
          value={form.dosage}
          onChangeText={(val) => setForm({ ...form, dosage: val })}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Instructions"
          value={form.instructions}
          multiline
          onChangeText={(val) => setForm({ ...form, instructions: val })}
        />

        {/* Inventory Management */}
        <Text style={styles.sectionLabel}>INVENTORY</Text>
        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={styles.smallLabel}>Remaining</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(form.inventory.remaining)}
              onChangeText={(val) =>
                updateNested("inventory", "remaining", parseInt(val) || 0)
              }
            />
          </View>
          <View style={{ width: 20 }} />
          <View style={styles.flex1}>
            <Text style={styles.smallLabel}>Total Stock</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(form.inventory.total)}
              onChangeText={(val) =>
                updateNested("inventory", "total", parseInt(val) || 0)
              }
            />
          </View>
        </View>

        {/* Configuration */}
        <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
        <CriticalToggle
          isCritical={form.notificationConfig.isCritical}
          onValueChange={(val) =>
            updateNested("notificationConfig", "isCritical", val)
          }
        />
        {/* <View style={styles.settingRow}>
          <Text style={styles.settingText}>Mark as Critical</Text>
          <Switch
            value={form.notificationConfig.isCritical}
            onValueChange={(val) =>
              updateNested("notificationConfig", "isCritical", val)
            }
            trackColor={{ false: "#767577", true: "#FF5252" }}
          />
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  saveBtn: { color: "#2196F3", fontWeight: "bold", fontSize: 16 },
  content: { padding: 20 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#aaa",
    marginBottom: 10,
    marginTop: 10,
  },
  smallLabel: { fontSize: 10, color: "#999", marginBottom: 4 },
  input: {
    backgroundColor: "#F5F7FA",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E1E8ED",
  },
  textArea: { height: 80, textAlignVertical: "top" },
  row: { flexDirection: "row" },
  flex1: { flex: 1 },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    padding: 15,
    borderRadius: 10,
  },
  settingText: { fontSize: 16, color: "#333" },
});

export default MedicationEditScreen;
