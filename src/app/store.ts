import { configureStore } from "@reduxjs/toolkit";
import battleReducer from "../features/battle/slice/battleSlice";

export const store = configureStore({
  reducer: {
    battle: battleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
