import { baseApi } from "../../baseApi/baseApi";

const landingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Public — GET /api/v1/landing?locale=en|nb
    // Returns full page data flattened to the requested locale (used by Next.js / landing site)
    getLandingPage: builder.query({
      query: (locale = "en") => ({
        url: `/landing`,
        method: "GET",
        params: { locale },
      }),
      transformResponse: (response) => response?.data,
      providesTags: [{ type: "landing", id: "PUBLIC" }],
    }),

    // Admin — GET /api/v1/admin/landing/:section
    // Valid sections: contact | hero | howItWorks | features | benefits | whyMobilklar | quote | about
    getLandingSection: builder.query({
      query: (section) => ({
        url: `/admin/landing/${section}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: (_result, _error, section) => [
        { type: "landing", id: section },
      ],
    }),

    // Admin — GET /api/v1/admin/landing
    getAllLandingSections: builder.query({
      query: () => ({
        url: `/admin/landing`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: [{ type: "landing", id: "ALL" }],
    }),

    // Admin — PATCH /api/v1/admin/landing/:section  (upsert — creates if missing)
    upsertLandingSection: builder.mutation({
      query: ({ section, body }) => ({
        url: `/admin/landing/${section}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { section }) => [
        { type: "landing", id: section },
        { type: "landing", id: "ALL" },
        { type: "landing", id: "PUBLIC" },
      ],
    }),

    // Admin — DELETE /api/v1/admin/landing/:section
    deleteLandingSection: builder.mutation({
      query: (section) => ({
        url: `/admin/landing/${section}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, section) => [
        { type: "landing", id: section },
        { type: "landing", id: "ALL" },
        { type: "landing", id: "PUBLIC" },
      ],
    }),
  }),
});

export const {
  useGetLandingPageQuery,
  useGetLandingSectionQuery,
  useGetAllLandingSectionsQuery,
  useUpsertLandingSectionMutation,
  useDeleteLandingSectionMutation,
} = landingApi;
