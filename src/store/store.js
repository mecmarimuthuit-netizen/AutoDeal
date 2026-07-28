import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import carReducer from "./carSlice";
import wishlistReducer from "./wishlistSlice";
import profileReducer from "./profileSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cars: carReducer,
    wishlist: wishlistReducer,
    profile: profileReducer,
  },
});

export default store;
