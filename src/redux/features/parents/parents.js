import { baseApi } from "../../baseApi/baseApi";

const parents = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllParents: builder.query({
      query: ({page, limit, search}) => ({
        url: `/admin/parents?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["Products"],
      transformResponse: (response) => response,
    }),
  }),
});

export const {
   useGetAllParentsQuery,
} = parents;
