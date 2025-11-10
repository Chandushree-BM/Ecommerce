import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/api';

const initialState = {
  items: [],
  isLoading: false,
  isError: false,
  message: '',
};

// Get cart
export const getCart = createAsyncThunk('cart/get', async (_, thunkAPI) => {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Add to cart
export const addToCart = createAsyncThunk('cart/add', async (data, thunkAPI) => {
  try {
    const response = await api.post('/cart', data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Update cart item
export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, quantity }, thunkAPI) => {
  try {
    const response = await api.put(`/cart/${itemId}`, { quantity });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Remove from cart
export const removeFromCart = createAsyncThunk('cart/remove', async (itemId, thunkAPI) => {
  try {
    const response = await api.delete(`/cart/${itemId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Clear cart
export const clearCart = createAsyncThunk('cart/clear', async (_, thunkAPI) => {
  try {
    const response = await api.delete('/cart');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.cart?.items || [];
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.cart?.items || [];
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.cart?.items || [];
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.cart?.items || [];
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { reset } = cartSlice.actions;
export default cartSlice.reducer;