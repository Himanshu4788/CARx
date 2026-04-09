import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "/api/v1/products";

export const fetchProducts = createAsyncThunk("products/fetchAll", async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await axios.get(`${API}?${query}`);
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || "Failed to fetch products"); }
});

export const fetchProduct = createAsyncThunk("products/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API}/${id}`);
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchMyProducts = createAsyncThunk("products/fetchMy", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API}/my`, { withCredentials: true });
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createProduct = createAsyncThunk("products/create", async (formData, { rejectWithValue }) => {
  try {
    const res = await axios.post(API, formData, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } });
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateProduct = createAsyncThunk("products/update", async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${API}/${id}`, formData, { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } });
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const deleteProduct = createAsyncThunk("products/delete", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API}/${id}`, { withCredentials: true });
    return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const submitReview = createAsyncThunk("products/review", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API}/${id}/review`, data, { withCredentials: true });
    return res.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    product: null,
    myProducts: [],
    loading: false,
    error: null,
    total: 0,
    pages: 1,
    currentPage: 1
  },
  reducers: {
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.total = action.payload.total || 0;
        state.pages = action.payload.pages || 1;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.products = [];
      })
      .addCase(fetchProduct.pending, (state) => { state.loading = true; })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.product;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.myProducts = action.payload.products || [];
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.myProducts = state.myProducts.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;