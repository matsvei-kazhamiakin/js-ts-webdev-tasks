import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userId: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  userId: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.userId = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUserId, clearUser } = userSlice.actions;
export default userSlice.reducer; 