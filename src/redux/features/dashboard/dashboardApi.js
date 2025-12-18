import { baseApi } from "../../baseApi/baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStatus: builder.query({
      query: () => ({
        url: "/admin/dashboard/stats",
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
    }),
    getIncomeRatio: builder.query({
      query: () => ({
        url: `/admin/dashboard/income-ratio`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
    }),
    getChildrenEarnings: builder.query({
      query: () => ({
        url: `/admin/dashboard/children-earnings-ratio`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
    }),
    getNewParents: builder.query({
      query: ({limit}) => ({
        url: `/admin/dashboard/new-parents?limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
    }),
  }),
});

export const { 
  useGetDashboardStatusQuery, 
  useGetIncomeRatioQuery, 
  useGetChildrenEarningsQuery,
  useGetNewParentsQuery,
} = dashboardApi;
