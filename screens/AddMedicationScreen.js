import React, { useState } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 1. IMPORT your boilerplate components
import FormHeader from "../components/FormHeader";
import MedicationForm from "../components/MedicationForm";

const AddMedicationScreen = ({ navigation }) => {
  const INITIAL_EMPTY_STATE = {
    id: Math.random().toString(36).substr(2, 9),
    name: "",
    dosage: "",
    instructions: "",
    color: "#4A90E2",
    icon: "pill",
    inventory: { remaining: 0, total: 0, refillAlertThreshold: 5 },
    schedule: {
      type: "fixed",
      intervalHours: 0,
      startDateTime: new Date().toISOString(), // Important to have a starting point
      activeDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      reminders: [],
    },
    notificationConfig: { isCritical: false, snoozeIntervalMinutes: 5 },
    lastTaken: null,
    nextScheduled: null,
  };

  const [form, setForm] = useState(INITIAL_EMPTY_STATE);

  // 2. DEFINE updateNested (It needs to exist in every file that uses it)
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
    if (!form.name || !form.dosage) {
      Alert.alert("Missing Info", "Please provide a name and dosage.");
      return;
    }

    console.log("Adding New Medication:", form);
    // Here you would eventually push this to your main data array
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 3. Pass the props your Header expects */}
      <FormHeader
        title="Add New"
        onSave={handleSave}
        onCancel={() => navigation.goBack()}
        actionText="Add"
      />

      {/* 4. This now has access to form, setForm, and updateNested */}
      <MedicationForm
        form={form}
        setForm={setForm}
        updateNested={updateNested}
      />
    </SafeAreaView>
  );
};

export default AddMedicationScreen;
