import { baseApi } from "../../baseApi/baseApi";

const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettingContentWithType: builder.query({
      query: (type) => ({
        url: `/admin/settings/content/${type}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["privacy_update"],
    }),
    updateContent: builder.mutation({
      query: (updateBody) => ({
        url: `/admin/settings/content`,
        method: "POST",
        body: updateBody,
      }),
      invalidatesTags: ["privacy_update"],
    }),
    getAboutUs: builder.query({
      query: () => ({
        url: "/info/about-us",
        method: "GET",
      }),
      transformResponse: (response) => response?.data?.attributes,
    }),
    getFaq: builder.query({
      query: () => ({
        url: "/admin/faqs",
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
    }),
    updateFaq: builder.mutation({
      query: ({ faqId, updateBody }) => ({
        url: `/admin/faqs/${faqId}`,
        method: "PATCH", // Changed to PATCH for updates
        body: updateBody,
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ["faqs"],
    }),
    createFaq: builder.mutation({
      query: (newFaq) => ({
        url: `/admin/faqs`,
        method: "POST",
        body: newFaq,
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ["faqs"],
    }),
    deleteFaq: builder.mutation({
      query: (faqId) => ({
        url: `/admin/faqs/${faqId}`,
        method: "DELETE",
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ["faqs"],
    }),
    getAgeSettings: builder.query({
      query: () => ({
        url: "/admin/age-settings",
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["age_settings"],
    }),
    updateAgeSettings: builder.mutation({
      query: (updateBody) => ({
        url: "/admin/age-settings",
        method: "PUT",
        body: updateBody,
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ["age_settings"],
    }),
  }),
});

export const {
  useGetSettingContentWithTypeQuery,
  useGetAboutUsQuery,
  useUpdateContentMutation,
  useGetFaqQuery,
  useUpdateFaqMutation,
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useGetAgeSettingsQuery,
  useUpdateAgeSettingsMutation,
} = settingApi;

// about_us contact_us privacy_policy terms_conditions
