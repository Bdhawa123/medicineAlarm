import React, { useState, useContext } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FormHeader from "../components/FormHeader";
import MedicationForm from "../components/MedicationForm";
import { Context as MedicationContext } from "../context/MedicationContext";

const MedicationEditScreen = ({ route, navigation }) => {
  const { med } = route.params;
  const { editMedication } = useContext(MedicationContext);
  const [form, setForm] = useState({ ...med });

  const updateNested = (category, key, value) => {
    setForm((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const computeNextScheduled = (startDateTime, intervalHours) => {
    const intervalNum = parseInt(intervalHours, 10);
    if (isNaN(intervalNum) || intervalNum <= 0) return null;

    const intervalMs = intervalNum * 60 * 60 * 1000;
    const base = startDateTime ? new Date(startDateTime) : new Date();
    let next = new Date(base.getTime() + intervalMs);

    // Advance until next dose is in the future
    const now = Date.now();
    while (next.getTime() <= now) {
      next = new Date(next.getTime() + intervalMs);
    }
    return next.toISOString();
  };

  const handleUpdate = () => {
    const nextScheduled =
      computeNextScheduled(form.schedule?.startDateTime, form.schedule?.intervalHours)
      ?? form.nextScheduled;

    editMedication({ ...form, nextScheduled });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <FormHeader
        title={`Edit ${med.name}`}
        onSave={handleUpdate}
        onCancel={() => navigation.goBack()}
        actionText="Save"
      />
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
