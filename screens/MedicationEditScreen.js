import React, { useState, useContext } from "react";
import { StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormHeader from "../components/FormHeader";
import MedicationForm from "../components/MedicationForm";
import { Context as MedicationContext } from "../context/MedicationContext";

const MedicationEditScreen = ({ route, navigation }) => {
  // 2. Grab the medication data passed from the list/detail screen
  const { med } = route.params;

  const { editMedication } = useContext(MedicationContext);
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
    editMedication(form);

    navigation.goBack();
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
