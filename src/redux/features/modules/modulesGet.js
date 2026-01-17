import { baseApi } from "../../baseApi/baseApi";

const modulesOne = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getModulesById: builder.query({
      query: (id) => ({
        url: `/admin/modules/${id}`,
        method: "GET",
      }),
      providesTags: ["modules"],
      transformResponse: (response) => response?.data,
    }),
    updateModulesOne: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/admin/modules/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
      invalidatesTags: ["modules"],
    }),
    uploadContentImage: builder.mutation({
      query: (body) => {
        return {
          url: `/admin/upload-image`,
          method: "POST",
          body: body,
        };
      },
      transformResponse: (res) => res?.data?.url,
    }),
    uploadIntroVideoOrCoverImage: builder.mutation({
      query: ({ moduleId, body }) => {
        return {
          url: `/admin/modules/${moduleId}`,
          method: "PATCH",
          body: body,
        };
      },
      transformResponse: (res) => res?.data,
    }),
  }),
});

export const {
  useGetModulesByIdQuery,
  useUpdateModulesOneMutation,
  useUploadContentImageMutation,
  useUploadIntroVideoOrCoverImageMutation,
} = modulesOne;
