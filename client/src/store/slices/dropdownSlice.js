import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userDropdown: false,
}

export const dropdownSlice = createSlice({
    name: 'dropdown',
    initialState: initialState,
    reducers: {
        toggleUserDropdown: (state) => {
            state.userDropdown = !state.userDropdown;
        },
    }
});

export const { toggleUserDropdown } = dropdownSlice.actions;
export default dropdownSlice.reducer;