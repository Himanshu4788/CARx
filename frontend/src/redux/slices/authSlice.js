import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "/api/v1/auth";

export const register = createAsyncThunk("auth/register", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API}/register`, data, { withCredentials: true });
    return res.data;
  } catch (err) { return rejectWithValue(err.response.data.message); }
});

export const login = createAsyncThunk("auth/login", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API}/login`, data, { withCredentials: true });
    return res.data;
  } catch (err) { return rejectWithValue(err.response.data.message); }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await axios.get(`${API}/logout`, { withCredentials: true });
});

export const loadUser = createAsyncThunk("auth/loadUser", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API}/me`, { withCredentials: true });
    return res.data;
  } catch (err) { return rejectWithValue(err.response.data.message); }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (data, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${API}/me/update`, data, { withCredentials: true });
    return res.data;
  } catch (err) { return rejectWithValue(err.response.data.message); }
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, isAuthenticated: false, loading: false, error: null },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(register.pending, pending)
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user; state.isAuthenticated = true;
      })
      .addCase(register.rejected, rejected)
      .addCase(login.pending, pending)
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user; state.isAuthenticated = true;
      })
      .addCase(login.rejected, rejected)
      .addCase(logout.fulfilled, (state) => {
        state.user = null; state.isAuthenticated = false;
      })
      .addCase(loadUser.pending, pending)
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false; state.user = action.payload.user; state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, (state) => { state.loading = false; state.isAuthenticated = false; })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;