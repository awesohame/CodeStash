import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: false,
    data: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        setUser: (state, action) => {
            state.status = true;
            state.data = action.payload;
        },
        removeUser: (state) => {
            state.status = false;
            state.data = null;
        },
    },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;