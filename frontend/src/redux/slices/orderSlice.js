import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createOrder = createAsyncThunk("orders/create", async (data, { rejectWithValue }) => {
  try { const res = await axios.post("/api/v1/orders", data, { withCredentials: true }); return res.data; }
  catch (err) { return rejectWithValue(err.response.data.message); }
});

export const fetchMyOrders = createAsyncThunk("orders/fetchMy", async (_, { rejectWithValue }) => {
  try { const res = await axios.get("/api/v1/orders/my", { withCredentials: true }); return res.data; }
  catch (err) { return rejectWithValue(err.response.data.message); }
});

export const fetchOrder = createAsyncThunk("orders/fetchOne", async (id, { rejectWithValue }) => {
  try { const res = await axios.get(`/api/v1/orders/${id}`, { withCredentials: true }); return res.data; }
  catch (err) { return rejectWithValue(err.response.data.message); }
});

const orderSlice = createSlice({
  name: "orders",
  initialState: { orders: [], order: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload.orders; })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchOrder.fulfilled, (state, action) => { state.order = action.payload.order; })
      .addCase(createOrder.fulfilled, (state, action) => { state.order = action.payload.order; });
  },
});

export default orderSlice.reducer;