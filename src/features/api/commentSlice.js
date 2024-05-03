import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const commentApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_URL}api/comments` }),
  endpoints: (builder) => ({
    addComment: builder.mutation({
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
      invalidatesTags: (result, error, id) => [{ type: 'Questions', id: 'LIST' }],
    }),
    updateComment: builder.mutation({
      query(args){
        const { id, token, body } = args
        return {
          url: `/${id}`,
          method: 'PATCH',
          body: body,
          headers: {
            'Accept': 'application/ld+json',
            'Content-Type': 'application/merge-patch+json',
            'Authorization': `bearer ${token}`
          }
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Questions', id: result.answer ? result.answer.question.id : result.question.id }],
    }),
    deleteComment: builder.mutation({
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
      invalidatesTags: (result, error, id) => [{ type: 'Comments', id}],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useAddCommentMutation, useUpdateCommentMutation, useDeleteCommentMutation } = commentApi