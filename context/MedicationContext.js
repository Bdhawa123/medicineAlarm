import React, { createContext, useState, useContext } from "react";
import initialData from "../mockDB/DBjson.json";
import createDataContext from "./createDataContext";
import { scheduleMedicationAlarm, cancelMedicationAlarm } from "../utils/notifications";

const medicationReducer = (state, action) => {
  switch (action.type) {
    case "ADD_MEDICATION":
      return { ...state, medications: [action.payload, ...state.medications] };

    case "EDIT_MEDICATION":
      return {
        ...state,
        medications: state.medications.map((med) =>
          med.id === action.payload.id ? action.payload : med,
        ),
      };

    case "DELETE_MEDICATION":
      return {
        ...state,
        medications: state.medications.filter(
          (med) => med.id !== action.payload.id,
        ),
      };

    case "ADD_ERROR":
      return { ...state, errorMessage: action.payload };

    default:
      return state;
  }
};

const addMedication = (dispatch) => (newMed) => {
  dispatch({ type: "ADD_MEDICATION", payload: newMed });
  scheduleMedicationAlarm(newMed);
};

const editMedication = (dispatch) => (updatedMed) => {
  dispatch({ type: "EDIT_MEDICATION", payload: updatedMed });
  scheduleMedicationAlarm(updatedMed);
};

const deleteMedication = (dispatch) => (id) => {
  dispatch({ type: "DELETE_MEDICATION", payload: { id } });
  cancelMedicationAlarm(id);
};
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

export const { Provider, Context } = createDataContext(
  medicationReducer,
  { addMedication, editMedication, deleteMedication },
  {
    medications: initialData.medications,
    INITIAL_EMPTY_STATE: INITIAL_EMPTY_STATE,
    errorMessage: "",
  },
);
