import { baseApi } from "../../baseApi/baseApi";

const modulesOne = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getModulesOneById: builder.query({
      query: (id) => ({
        url: `/admin/modules/${id}`,
        method: "GET",
      }),
      providesTags: ["modulesOnes"],
      transformResponse: (response) => response,
    }),
    updateModulesOne: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/admin/modules/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
      invalidatesTags: ["modulesOnes"],
    }),
  }),
});

export const { useGetModulesOneByIdQuery, useUpdateModulesOneMutation } =
  modulesOne;
