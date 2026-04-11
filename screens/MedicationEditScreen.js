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

  const handleUpdate = () => {
    editMedication(form);
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
