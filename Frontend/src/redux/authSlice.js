import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/login', { email, password }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });

      const { status, userId, message } = response.data;

      if (status === 200 && userId) {
        return { userId };
      } else {
        return rejectWithValue(message || '아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || '서버에 연결할 수 없습니다.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    status: 'idle',
    error: null
  },
  reducers: {
    loginSuccess(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = { id: action.payload.userId };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
