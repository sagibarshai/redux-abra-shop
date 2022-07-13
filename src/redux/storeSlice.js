import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ITEMS_ENDPOINT, SERVER_URL } from "../constants";

const initialState = {
  items: [],
  cart: [],
};

export const fetchStoreItems = createAsyncThunk(
  "store/fetchStoreItems",
  async (_, thunkAPI) => {
    const response = await fetch(SERVER_URL + "/" + ITEMS_ENDPOINT);
    const data = await response.json();
    return data;
  }
);
export const storeSlice = createSlice({
  name: "store",
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const itemId = action.payload;
      const storeItem = state.items.find((element) => element.id === itemId);
      if (storeItem.quantity === 0) return;

      storeItem.quantity--;

      let cartItem = state.cart.find((element) => element.id === itemId);

      if (!cartItem) {
        cartItem = { ...storeItem, quantity: 0 };
        state.cart = [...state.cart, cartItem];
      }

      cartItem.quantity++;
    },
    removeItemFromCart: (state, action) => {
      let itemId ;
      if(action.payload.data) {
        if(action.payload.data.case = 'REMOVE') {
          itemId = action.payload.data.itemId;
          let updatedItems = [...state.items]
          let item  = updatedItems.find(item => item.id === itemId)
          let itemIndex = updatedItems.findIndex(item => item.id === itemId)
          let cartItem = state.cart.find((element) => element.id === itemId);
        let updatedQuantity = item.quantity + cartItem.quantity 
        item = {...item , quantity:updatedQuantity}
        updatedItems[itemIndex] = item 
        
        state.items = updatedItems 
        state.cart = [...state.cart].filter(item => item.id !==itemId)
        
        return
      }}
      itemId = action.payload 
      const storeItem = state.items.find((element) => element.id === itemId);
      storeItem.quantity++;
      let cartItem = state.cart.find((element) => element.id === itemId);

      if (cartItem.quantity === 1) {
        cartItem = { ...storeItem, quantity: 0 };
        state.cart = [...state.cart].filter(item => item.id!==itemId);
      }

      cartItem.quantity--;
    },
    checkout: (state, action) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStoreItems.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  },
});

export const { removeItemFromCart ,addItemToCart, checkout } = storeSlice.actions;

export default storeSlice.reducer;
