import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    onMobile: false,
}

export const deviceSlice = createSlice({
    name: 'device',
    initialState: initialState,
    reducers: {
        setOnMobile: (state, action) => {
            state.onMobile = action.payload;
        },
    },
});

export const { setOnMobile } = deviceSlice.actions;
export default deviceSlice.reducer;