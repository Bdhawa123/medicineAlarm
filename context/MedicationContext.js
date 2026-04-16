import React, { createContext, useState, useContext } from "react";
import initialData from "../mockDB/DBjson.json";
import logData from "../mockDB/Log.json";
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

const takeMedication = (dispatch) => (medication) => {
  // 1. Reduce inventory (don't go below 0)
  const remaining = Math.max(0, medication.inventory.remaining - 1);
  
  // 2. Update lastTaken to exact current time
  const lastTaken = new Date().toISOString();

  // 3. Compute the nextScheduled date advancing from the start rhythm
  let nextScheduled = medication.nextScheduled;
  const intervalNum = parseInt(medication.schedule?.intervalHours, 10);
  
  if (!isNaN(intervalNum) && intervalNum > 0) {
    const intervalMs = intervalNum * 60 * 60 * 1000;
    const base = medication.schedule?.startDateTime ? new Date(medication.schedule.startDateTime) : new Date();
    let next = new Date(base.getTime() + intervalMs);

    const now = Date.now();
    while (next.getTime() <= now) {
      next = new Date(next.getTime() + intervalMs);
    }
    nextScheduled = next.toISOString();
  }

  // Set the newly updated object
  const updatedMed = {
    ...medication,
    inventory: { ...medication.inventory, remaining },
    lastTaken,
    nextScheduled
  };

  // Logically, taking a med works identically to editing its data explicitly
  dispatch({ type: "EDIT_MEDICATION", payload: updatedMed });
  
  // Advance the push notification alarm!
  scheduleMedicationAlarm(updatedMed);
};
const INITIAL_EMPTY_STATE = {
  id: "",
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
  { addMedication, editMedication, deleteMedication, takeMedication },
  {
    medications: initialData.medications,
    confirmationLogs: logData.confirmationLogs,
    INITIAL_EMPTY_STATE: INITIAL_EMPTY_STATE,
    errorMessage: "",
  },
);
