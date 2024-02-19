import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const voteApi = createApi({
  reducerPath: 'voteApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://clueless.dvl.to/api/votes' }),
  endpoints: (builder) => ({
    getVotes: builder.query({
        query(parameters) {
            const {url, token} = parameters;
            return {
                url: url,
                method: 'GET',
                headers: {
                    'Authorization': `bearer ${token}`
                  }
            }
        },
        providesTags: (result, error, id) => [{ type: 'Votes', id }],
    }),
    addVote: builder.mutation({
      query(arg) {
        const { body, token } = arg;
        return {
          method: `POST`,
          body: body, 
          headers: {
            'Accept': 'application/ld+json',
            'Content-Type': 'application/ld+json',
            'Authorization': `bearer ${token}`
          }
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Votes', id }],
    }),
    updateVote: builder.mutation({
      query(args){
        const { id, token, body } = args
        return {
          url: `/${id}`,
          method: 'PUT',
          body: body,
          headers: {
            'Accept': 'application/ld+json',
            'Content-Type': 'application/ld+json',
            'Authorization': `bearer ${token}`
          }
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Votes', id }],
    }),
    deleteVote: builder.mutation({
      query(args) {
        const { id, token } = args
        return {
          url: `/${id}`,
          method: 'DELETE',
          headers: {
            'Authorization': `bearer ${token}`
          }
        }
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      invalidatesTags: (result, error, id) => [{ type: 'Votes', id}],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {  useGetVotesQuery, useAddVoteMutation, useUpdateVoteMutation, useDeleteVoteMutation } = voteApi