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
  }),
});

export const {
  useGetSettingContentWithTypeQuery,
  useGetAboutUsQuery,
  useUpdateContentMutation,
} = settingApi;

// about_us contact_us privacy_policy terms_conditions
