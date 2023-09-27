// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Product } from "../../@types/carts/carts";

// Define a service using a base URL and expected endpoints
export const cartsApi = createApi({
  reducerPath: "cartsApi",
  tagTypes: ["Cart"],
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_apiUrl }),
  endpoints: (builder) => ({
    /**
     * Fetches all the products in the cart
     */
    findCartProducts: builder.query<
      Product[],
      {
        query: string;
      }
    >({
      query: ({ query }) => ({
        url: `/carts${query && `?q=${query}`}`,
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),

    /**
     * Updates the cart status
     */
    updateProductStatus: builder.mutation<
      Product,
      { id: number; cart: Partial<Product> }
    >({
      query: ({ id, cart }) => ({
        url: `/carts/${id}`,
        method: "PUT",
        body: cart,
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useFindCartProductsQuery, useUpdateProductStatusMutation } =
  cartsApi;
