import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import modalReducer from "./slices/modalSlice";
import deviceReducer from "./slices/deviceSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        modal: modalReducer,
        device: deviceReducer,
    },
});