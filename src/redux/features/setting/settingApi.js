import { baseApi } from "../../baseApi/baseApi";

const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTermsCondition: builder.query({
      query: () => ({
        url: "/info/terms-condition",
        method: "GET",
      }),
      transformResponse: (response) => response?.data?.attributes,
    }),
    getPrivacyPolicy: builder.query({
      query: () => ({
        url: "/info/privacy-policy",
        method: "GET",
      }),
      transformResponse: (response) => response?.data?.attributes,
    }),
    getAboutUs: builder.query({
      query: () => ({
        url: "/info/about-us",
        method: "GET",
      }),
      transformResponse: (response) => response?.data?.attributes,
    }),
  }),
});

export const {
  useGetTermsConditionQuery,
  useGetPrivacyPolicyQuery,
  useGetAboutUsQuery,
} = settingApi;
