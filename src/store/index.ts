import { configureStore } from "@reduxjs/toolkit";
import memesReducer from "@/features/memes/memesSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      memes: memesReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

