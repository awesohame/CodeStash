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
        closeUserDropdown: (state) => {
            state.userDropdown = false;
        }
    }
});

export const { toggleUserDropdown, closeUserDropdown } = dropdownSlice.actions;
export default dropdownSlice.reducer;