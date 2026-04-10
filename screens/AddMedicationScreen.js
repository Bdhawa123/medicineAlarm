import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import CriticalToggle from "../utils/CriticalToggle";
import ScheduleSection from "../utils/ScheduleSection";

const AddMedicationScreen = ({ navigation }) => {
  // 1. Define the initial empty structure matching your JSON
  const [form, setForm] = useState({
    id: Math.random().toString(36).substr(2, 9), // Temporary ID generator
    name: "",
    dosage: "",
    instructions: "",
    color: "#4A90E2",
    icon: "pill",
    inventory: { remaining: 0, total: 0, refillAlertThreshold: 5 },
    schedule: {
      type: "fixed",
      intervalHours: 0,
      activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      reminders: [],
    },
    notificationConfig: { isCritical: false, snoozeIntervalMinutes: 5 },
    lastTaken: null,
    nextScheduled: null,
  });

  const updateNested = (category, key, value) => {
    setForm((prev) => ({
      ...prev,
      [category]: { ...prev[category], [key]: value },
    }));
  };

  const handleAdd = () => {
    if (!form.name || !form.dosage) {
      Alert.alert("Missing Info", "Please enter at least the name and dosage.");
      return;
    }

    // In the next step, we will pass this back to the main list
    console.log("New Medication Object:", form);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Medication</Text>
        <TouchableOpacity onPress={handleAdd}>
          <Text style={styles.addBtn}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>BASIC INFO</Text>
        <TextInput
          style={styles.input}
          placeholder="Medication Name (e.g. Amoxicillin)"
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
          placeholder="Special Instructions"
          multiline
          value={form.instructions}
          onChangeText={(val) => setForm({ ...form, instructions: val })}
        />

        <Text style={styles.sectionLabel}>INVENTORY SETUP</Text>
        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={styles.smallLabel}>Current Stock</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="0"
              onChangeText={(val) =>
                updateNested("inventory", "remaining", parseInt(val) || 0)
              }
            />
          </View>
          <View style={{ width: 20 }} />
          <View style={styles.flex1}>
            <Text style={styles.smallLabel}>Total Capacity</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="0"
              onChangeText={(val) =>
                updateNested("inventory", "total", parseInt(val) || 0)
              }
            />
          </View>
        </View>

        <ScheduleSection
          form={form}
          updateNested={updateNested}
          setForm={setForm}
        />

        <Text style={styles.sectionLabel}>SETTINGS</Text>
        <CriticalToggle
          isCritical={form.notificationConfig.isCritical}
          onValueChange={(val) =>
            updateNested("notificationConfig", "isCritical", val)
          }
        />
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
  addBtn: { color: "#4CAF50", fontWeight: "bold", fontSize: 16 },
  content: { padding: 20 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#aaa",
    marginBottom: 10,
    marginTop: 15,
  },
  smallLabel: { fontSize: 10, color: "#999", marginBottom: 4 },
  input: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E1E8ED",
  },
  textArea: { height: 100, textAlignVertical: "top" },
  row: { flexDirection: "row" },
  flex1: { flex: 1 },
});

export default AddMedicationScreen;
