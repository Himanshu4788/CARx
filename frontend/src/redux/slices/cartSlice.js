import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCart = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
  try { const res = await axios.get("/api/v1/cart", { withCredentials: true }); return res.data; }
  catch (err) { return rejectWithValue(err.response.data.message); }
});

export const addToCart = createAsyncThunk("cart/add", async (data, { rejectWithValue }) => {
  try { const res = await axios.post("/api/v1/cart", data, { withCredentials: true }); return res.data; }
  catch (err) { return rejectWithValue(err.response.data.message); }
});

export const updateCartItem = createAsyncThunk("cart/update", async ({ productId, quantity }, { rejectWithValue }) => {
  try { const res = await axios.put(`/api/v1/cart/${productId}`, { quantity }, { withCredentials: true }); return res.data; }
  catch (err) { return rejectWithValue(err.response.data.message); }
});

export const removeFromCart = createAsyncThunk("cart/remove", async (productId, { rejectWithValue }) => {
  try { const res = await axios.delete(`/api/v1/cart/${productId}`, { withCredentials: true }); return res.data; }
  catch (err) { return rejectWithValue(err.response.data.message); }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], total: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    const updateState = (state, action) => {
      state.loading = false;
      state.items = action.payload.cart?.items || [];
      state.total = action.payload.total || 0;
    };
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, updateState)
      .addCase(addToCart.fulfilled, updateState)
      .addCase(updateCartItem.fulfilled, updateState)
      .addCase(removeFromCart.fulfilled, updateState);
  },
});

export default cartSlice.reducer;