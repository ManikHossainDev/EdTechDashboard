
import { baseApi } from "../../baseApi/baseApi";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => ({
        url:"/users/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: "/admin/profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
      transformResponse: (response) => response,
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response,
    }),
    UploadImage:builder.mutation({
      query: (data) => ({
        url: "/admin/profile/upload-picture",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => response,
    })
  }),
});


export const {
  useGetUserQuery,
  useUpdateUserMutation,
  useChangePasswordMutation,
  useUploadImageMutation,
} = profileApi;
