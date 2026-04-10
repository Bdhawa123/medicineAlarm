import React, { useState } from "react";
import { StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 1. Import your shared components
import FormHeader from "../components/FormHeader";
import MedicationForm from "../components/MedicationForm";

const MedicationEditScreen = ({ route, navigation }) => {
  // 2. Grab the medication data passed from the list/detail screen
  const { med } = route.params;

  // 3. Initialize state with the existing medication object
  const [form, setForm] = useState({ ...med });

  // 4. Logic to update nested objects (inventory, schedule, etc.)
  const updateNested = (category, key, value) => {
    setForm((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const handleUpdate = () => {
    // Basic Validation
    if (!form.name.trim()) {
      Alert.alert("Error", "Medication name cannot be empty.");
      return;
    }

    // This is where you'd trigger your save function/API
    console.log("Saving updated medication:", form);

    Alert.alert("Success", "Changes saved!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 5. The Shared Header */}
      <FormHeader
        title={`Edit ${med.name}`}
        onSave={handleUpdate}
        onCancel={() => navigation.goBack()}
        actionText="Save"
      />

      {/* 6. The Shared Form Boilerplate */}
      <MedicationForm
        form={form}
        setForm={setForm}
        updateNested={updateNested}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default MedicationEditScreen;
