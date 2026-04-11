import React, { useState, useContext } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Context as MedicationContext } from "../context/MedicationContext";
import FormHeader from "../components/FormHeader";
import MedicationForm from "../components/MedicationForm";

const AddMedicationScreen = ({ navigation }) => {
  const { addMedication, state } = useContext(MedicationContext);
  const [form, setForm] = useState(state.INITIAL_EMPTY_STATE);

  const handleSave = () => {
    addMedication(form);
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
