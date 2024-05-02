import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const scoreApi = createApi({
  reducerPath: 'scoreApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_URL}api/scores` }),
  endpoints: (builder) => ({
    getScore: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Score', id }] 
    }),
    getScores: builder.query({
      query(parameters) {
        const { page, filter} = parameters;
        return {
          url: `${filter}${page}`,
        }
      },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetScoreQuery, useGetScoresQuery } = scoreApi