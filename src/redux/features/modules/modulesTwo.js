import { baseApi } from "../../baseApi/baseApi";

const modulesOne = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getModulesTwoById: builder.query({
      query: (id) => ({
        url: `/admin/modules/${id}`,
        method: "GET",
      }),
      providesTags: ["modulesOnes"],
      transformResponse: (response) => response,
    }),
    updateModulesTwo: builder.mutation({
      query: ({ id, updatedData }) => {
        return {
          url: `/admin/modulesOne/${id}`,
          method: "PATCH",
          body: updatedData,
        };
      },
      invalidatesTags: ["modulesOnes"],
    }),
  }),
});

export const { useGetModulesTwoByIdQuery, useUpdateModulesTwoMutation } =
  modulesOne;
