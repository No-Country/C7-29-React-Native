import { createSlice } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  cartItems: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, { payload }) => {
      if (payload) {
        if (
          !(state.cartItems.filter((x) => x._id === payload._id).length > 0)
        ) {
          state.cartItems.push(payload);
          state.total = state.total + payload.price;
          AsyncStorage.setItem("cart", JSON.stringify(state));
        }
      }
    },
    localStorageCart: (state, { payload }) => {
      state = payload || [];
    },
    cleanCart: (state) => {
      state.cartItems = initialState.cartItems;
      state.total = initialState.total;
      AsyncStorage.setItem("cart", JSON.stringify({}));
    },
    cleanItem: (state, { payload }) => {
      var removePrice = state.cartItems.filter((x) => x._id === payload);
      state.cartItems = state.cartItems.filter((x) => x._id !== payload);
      state.total = state.total - removePrice[0].price;
      AsyncStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const { addItemToCart, localStorageCart, cleanCart, cleanItem } =
  cartSlice.actions;
export default cartSlice.reducer;
