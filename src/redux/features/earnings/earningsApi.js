import { baseApi } from "../../baseApi/baseApi";

const earningsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEarnings: builder.query({
      query: ({ page, limit, search }) => ({
        url: `/admin/transactions?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
    }),
  }),
});

export const { useGetEarningsQuery } = earningsApi;
