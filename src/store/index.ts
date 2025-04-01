import { configureStore } from "@reduxjs/toolkit";
import colorReducer from "./colorSlice";
import motorReducer from "./motorSlice";
import positionListReducer from "./positionListSlice";

export const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
    colorReducer,
    motorReducer,
    positionListReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
