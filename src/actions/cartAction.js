// frontend/src/actions/cartAction.js

import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";
import axios from "axios";

// ✅ Add to Cart (initial fetch only if not in cart)
export const addItemsToCart = (id, quantity) => async (dispatch, getState) => {
  const { cartItems } = getState().cart;

  // Check if product already in cart
  const existingItem = cartItems.find((i) => i.product === id);

  let item;

  if (existingItem) {
    // If product already exists → just update quantity
    item = { ...existingItem, quantity };
  } else {
    // If product not in cart → fetch from backend
    const { data } = await axios.get(`/api/v1/product/${id}`);

    item = {
      product: data.product._id,
      name: data.product.name,
      price: data.product.price,
      image: data.product.images[0].url,
      // FIX: Ensure you are saving the Stock property from the backend
      stock: data.product.Stock,
      quantity,
    };
  }

  // Dispatch to reducer
  dispatch({
    type: ADD_TO_CART,
    payload: item,
  });

  // Save to localStorage
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// ✅ Remove from Cart
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_CART_ITEM,
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// ✅ Save Shipping Info
export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  });

  localStorage.setItem("shippingInfo", JSON.stringify(data));
};