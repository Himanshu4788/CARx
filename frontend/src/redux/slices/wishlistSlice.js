import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchWishlist = createAsyncThunk("wishlist/fetch", async (_, { rejectWithValue }) => {
  try { const res = await axios.get("/api/v1/wishlist", { withCredentials: true }); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const toggleWishlist = createAsyncThunk("wishlist/toggle", async (productId, { rejectWithValue }) => {
  try { const res = await axios.post(`/api/v1/wishlist/${productId}`, {}, { withCredentials: true }); return res.data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { products: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.products = action.payload.wishlist?.products || []; })
      .addCase(toggleWishlist.fulfilled, (state, action) => { state.products = action.payload.wishlist?.products || []; });
  },
});

export default wishlistSlice.reducer;