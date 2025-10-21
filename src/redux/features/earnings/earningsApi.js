import { baseApi } from "../../baseApi/baseApi";

const earningsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEarnings: builder.query({
      query: () => ({
        url: "/admin/getRecentTransactions",
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
    }),
  }),
});

export const { useGetEarningsQuery } = earningsApi;
