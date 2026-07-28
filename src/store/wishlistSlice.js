import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getWishlist as getWishlistService,
  addToWishlist as addToWishlistService,
  removeFromWishlist as removeFromWishlistService,
} from "../services/wishlistService";

export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
      return await getWishlistService();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (carId, { rejectWithValue }) => {
    try {
      const response = await addToWishlistService(carId);

      return response?.data || carId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (carId, { rejectWithValue }) => {
    try {
      await removeFromWishlistService(carId);

      return carId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const initialState = {
  wishlist: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState,

  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
      })

      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;

        state.wishlist =
          action.payload?.data ||
          action.payload?.wishlist ||
          action.payload?.rows ||
          action.payload ||
          [];
      })

      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
      })

      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;

        const item = action.payload?.data || action.payload;

        if (typeof item === "object" && item !== null) {
          state.wishlist.push(item);
        } else {
          state.wishlist.push({
            car_id: item,
          });
        }
      })

      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
      })

      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;

        state.wishlist = state.wishlist.filter(
          (item) =>
            item.car_id !== action.payload && item.id !== action.payload,
        );
      })

      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlistError } = wishlistSlice.actions;

export default wishlistSlice.reducer;
