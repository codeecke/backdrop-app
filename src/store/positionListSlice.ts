import { TPosition } from "@/classes/ClientCommands/PositionListCommand";
import { createSlice } from "@reduxjs/toolkit";

interface PositionListState {
  positions: TPosition[];
}

const initialState: PositionListState = {
  positions: [],
};

const positionListSlice = createSlice({
  name: "positionList",
  initialState,
  reducers: {
    setPositionList(
      state: PositionListState,
      { payload }: { payload: TPosition[] }
    ) {
      state.positions = payload;
      return state;
    },
  },
});

export const { setPositionList } = positionListSlice.actions;
export default positionListSlice.reducer;
