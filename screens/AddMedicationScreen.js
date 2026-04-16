import React, { useState, useContext } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Context as MedicationContext } from "../context/MedicationContext";
import FormHeader from "../components/FormHeader";
import MedicationForm from "../components/MedicationForm";

const AddMedicationScreen = ({ navigation }) => {
  const { addMedication, state } = useContext(MedicationContext);
  const [form, setForm] = useState(() => {
    const id = Math.random().toString(36).substr(2, 9);
    return {
      ...state.INITIAL_EMPTY_STATE,
      id,
      qrCode: `MED-${id.toUpperCase()}`,
    };
  });

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

  const handleSave = () => {
    const nextScheduled =
      computeNextScheduled(form.schedule?.startDateTime, form.schedule?.intervalHours)
      ?? form.nextScheduled;

    addMedication({ ...form, nextScheduled });
    navigation.goBack();
  };

  const updateNested = (category, key, value) => {
    setForm((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>

      <FormHeader
        title="Add New"
        onSave={handleSave}
        onCancel={() => navigation.goBack()}
        actionText="Add"
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

export default AddMedicationScreen;
