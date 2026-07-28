import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getMyCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from "../services/carService";

export const fetchMyCars = createAsyncThunk(
  "cars/fetchMyCars",
  async (_, { rejectWithValue }) => {
    try {
      return await getMyCars();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchCar = createAsyncThunk(
  "cars/fetchCar",
  async (id, { rejectWithValue }) => {
    try {
      return await getCarById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const addCar = createAsyncThunk(
  "cars/addCar",
  async (formData, { rejectWithValue }) => {
    try {
      return await createCar(formData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const editCar = createAsyncThunk(
  "cars/editCar",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      return await updateCar({
        id,
        formData,
      });
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const removeCar = createAsyncThunk(
  "cars/removeCar",
  async (id, { rejectWithValue }) => {
    try {
      await deleteCar(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: "Delete failed",
        },
      );
    }
  },
);

const initialState = {
  cars: [],
  car: null,
  loading: false,
  error: null,
};

const carSlice = createSlice({
  name: "cars",

  initialState,

  reducers: {
    clearCarError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(fetchMyCars.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchMyCars.fulfilled, (state, action) => {
        state.loading = false;

        state.cars =
          action.payload?.data || action.payload?.cars || action.payload || [];
      })

      .addCase(fetchMyCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchCar.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchCar.fulfilled, (state, action) => {
        state.loading = false;

        state.car = action.payload?.data || action.payload;
      })

      .addCase(fetchCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addCar.pending, (state) => {
        state.loading = true;
      })

      .addCase(addCar.fulfilled, (state, action) => {
        state.loading = false;

        state.cars.unshift(action.payload?.data || action.payload);
      })

      .addCase(addCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(editCar.pending, (state) => {
        state.loading = true;
      })

      .addCase(editCar.fulfilled, (state, action) => {
        state.loading = false;

        const updated = action.payload?.data || action.payload;

        state.cars = state.cars.map((car) =>
          car.id === updated.id ? updated : car,
        );
      })

      .addCase(editCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeCar.pending, (state) => {
        state.loading = true;
      })

      .addCase(removeCar.fulfilled, (state, action) => {
        state.loading = false;

        state.cars = state.cars.filter((car) => car.id !== action.payload);
      })

      .addCase(removeCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCarError } = carSlice.actions;

export default carSlice.reducer;
