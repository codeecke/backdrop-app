import { Motor } from "@/classes/socketClients/Motor";
import { createSlice } from "@reduxjs/toolkit";

import { useSelector } from "react-redux";
import { RootState } from ".";
import { TMotorId } from "@/classes/DeviceCommands";

interface MotorState {
  motors: Motor[];
  activeMotor: Motor | undefined;
}

const initialState: MotorState = {
  motors: [],
  activeMotor: undefined,
};

const motorSlice = createSlice({
  name: "motor",
  initialState,
  reducers: {
    setMotors(state, { payload }: { payload: Motor[] }) {
      state.motors = payload;
    },
    setActiveMotorId(state, { payload }: { payload: TMotorId | undefined }) {
      if (typeof payload === "undefined") {
        state.activeMotor = undefined;
        return;
      }
      state.activeMotor = state.motors.find(
        (motor) => motor.motorId === payload
      );
    },
  },
});

export function useActiveMotor(): Motor | undefined {
  return useSelector((state: RootState) => state.motorReducer.activeMotor);
}

export const { setMotors, setActiveMotorId } = motorSlice.actions;

export default motorSlice.reducer;
