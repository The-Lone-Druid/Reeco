// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Order } from "../../@types/orders/orders";

// Define a service using a base URL and expected endpoints
export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_apiUrl }),
  endpoints: (builder) => ({
    /**
     * Fetches a single order by its ID
     */
    findOrderById: builder.mutation<Order, string>({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "GET",
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useFindOrderByIdMutation } = ordersApi;
