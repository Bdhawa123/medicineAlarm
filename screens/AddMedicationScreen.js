import React, { useState, useContext } from "react";
import { Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Context as MedicationContext } from "../context/MedicationContext";

// 1. IMPORT your boilerplate components
import FormHeader from "../components/FormHeader";
import MedicationForm from "../components/MedicationForm";

const AddMedicationScreen = ({ navigation }) => {
  const { addMedication, state } = useContext(MedicationContext);
  const [form, setForm] = useState(state.INITIAL_EMPTY_STATE);

  const handleSave = () => {
    addMedication(form);
    navigation.goBack();
  };

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
