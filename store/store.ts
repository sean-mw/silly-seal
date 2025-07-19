import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import sealReducer from "./sealSlice";
import cleanGameReducer from "./cleanGameSlice";
import depthGameReducer from "./depthGameSlice";
import feedGameReducer from "./feedGameSlice";
import storage from "./storage";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  seal: sealReducer,
  cleanGame: cleanGameReducer,
  depthGame: depthGameReducer,
  feedGame: feedGameReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
