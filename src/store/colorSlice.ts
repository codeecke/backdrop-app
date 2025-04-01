import { TMotorConfigurationItem } from "@/classes/ClientCommands/MotorConfigurationCommand";
import { createSlice } from "@reduxjs/toolkit";

interface ColorState {
  selected: TMotorConfigurationItem | undefined;
  available: TMotorConfigurationItem[];
}

const initialState: ColorState = {
  selected: undefined,
  available: [],
};

const colorSlice = createSlice({
  name: "color",
  initialState,
  reducers: {
    setAvailableColors(
      state: ColorState,
      { payload }: { payload: TMotorConfigurationItem[] }
    ) {
      state.available = payload;
    },
    setSelectedColor: (
      state: ColorState,
      { payload }: { payload: TMotorConfigurationItem }
    ) => {
      state.selected = payload;
    },
  },
});

export const { setSelectedColor, setAvailableColors } = colorSlice.actions;

export default colorSlice.reducer;
