// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Cart } from "../../@types/carts/carts";

// Define a service using a base URL and expected endpoints
export const cartsApi = createApi({
  reducerPath: "cartsApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_apiUrl }),
  endpoints: (builder) => ({
    findCartById: builder.mutation<Cart, string>({
      query: (cartId) => ({
        url: `/carts/${cartId}`,
        method: "GET",
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useFindCartByIdMutation } = cartsApi;
