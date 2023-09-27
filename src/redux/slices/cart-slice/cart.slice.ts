import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

// Define a type for the slice state
interface CartState {
  totalCartItems: number;
}

// Define the initial state using that type
const initialState: CartState = {
  totalCartItems: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setTotalCartItems: (state, action: PayloadAction<number>) => {
      state.totalCartItems = action.payload;
    },
    clearTotalCartItems: (state) => {
      state.totalCartItems = 0;
    },
  },
});

export const { setTotalCartItems, clearTotalCartItems } = cartSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectTotalCartItems = (state: RootState) =>
  state.cart.totalCartItems;

export default cartSlice.reducer;
