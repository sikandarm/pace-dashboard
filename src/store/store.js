import { configureStore,combineReducers } from "@reduxjs/toolkit";
import userSlice from "../feature/userSlice";
import inventorySlice from "../feature/inventorySlice";
import jobSlice from "../feature/jobSlice";
import permissionSlice from "../feature/permissionsSlice";
import roleSlice from "../feature/roleSlice";
import tasksSlice from "../feature/tasksSlice";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import thunk from 'redux-thunk'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userSlice'], // Add the desired reducers to persist
};

export const rootReducer = combineReducers({
    userSlice,
    inventorySlice,
    jobSlice,
    permissionSlice,
    tasksSlice,
    roleSlice
})
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store)
