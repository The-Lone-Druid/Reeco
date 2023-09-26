import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import counterReducer from "./slices/counter-slice/counter.slice";
import { ordersApi } from "../services/orders-service/orders.service";
import { cartsApi } from "../services/carts-service/carts.service";

export const store = configureStore({
  reducer: {
    // Add reducers here
    counter: counterReducer,
    // Add RTK Query Services here
    // Add the generated reducer as a specific top-level slice
    [ordersApi.reducerPath]: ordersApi.reducer,
    [cartsApi.reducerPath]: cartsApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(ordersApi.middleware)
      .concat(cartsApi.middleware),
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
