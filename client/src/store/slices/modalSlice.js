import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loginModal: false,
    registerModal: false,
}

export const modalSlice = createSlice({
    name: 'modal',
    initialState: initialState,
    reducers: {
        setLoginModal: (state, action) => {
            state.loginModal = action.payload;
        },
        setRegisterModal: (state, action) => {
            state.registerModal = action.payload;
        },
    },
});

export const { setLoginModal, setRegisterModal } = modalSlice.actions;
export default modalSlice.reducer;