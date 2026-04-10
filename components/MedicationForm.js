import React from "react";
import { View, Text, StyleSheet, TextInput, ScrollView } from "react-native";
import ScheduleSection from "./ScheduleSection";
import CriticalToggle from "../utils/CriticalToggle";

const MedicationForm = ({ form, setForm, updateNested }) => {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      {/* BASIC INFO */}
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

      {/* INVENTORY */}
      <Text style={styles.sectionLabel}>INVENTORY</Text>
      <View style={styles.row}>
        <View style={styles.flex1}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Remaining"
            value={String(form.inventory.remaining)}
            onChangeText={(val) =>
              updateNested("inventory", "remaining", parseInt(val) || 0)
            }
          />
        </View>
        <View style={{ width: 20 }} />
        <View style={styles.flex1}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Total"
            value={String(form.inventory.total)}
            onChangeText={(val) =>
              updateNested("inventory", "total", parseInt(val) || 0)
            }
          />
        </View>
      </View>

      {/* SCHEDULE SECTION (Reused) */}
      <ScheduleSection
        form={form}
        setForm={setForm}
        updateNested={updateNested}
      />

      {/* NOTIFICATIONS */}
      <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
      <CriticalToggle
        isCritical={form.notificationConfig.isCritical}
        onValueChange={(val) =>
          updateNested("notificationConfig", "isCritical", val)
        }
      />
    </ScrollView>
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

// ... Reuse your existing styles here ...
export default MedicationForm;
