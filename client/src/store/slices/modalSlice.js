import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: false,
    loginModal: false,
    registerModal: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setLoginModal: (state, action) => {
            state.status = true;
            state.loginModal = action.payload;
        },
        setRegisterModal: (state, action) => {
            state.status = true;
            state.registerModal = action.payload;
        },
    },
});

export const { setLoginModal, setRegisterModal } = userSlice.actions;
export default userSlice.reducer;