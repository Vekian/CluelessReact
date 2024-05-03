import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const answerApi = createApi({
  reducerPath: 'answerApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_URL}api/answers` }),
  endpoints: (builder) => ({
    addAnswer: builder.mutation({
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
      invalidatesTags: (result, error) => [{ type: 'Questions', id: result.question.id }, { type: 'Questions', id: 'LIST' }],
    }),
    updateAnswer: builder.mutation({
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
      invalidatesTags: (result, error) => [{ type: 'Questions', id: result.question.id }],
    }),
    validateAnswer: builder.mutation({
      query(args){
        const { id, token, body } = args
        return {
          url: `/${id}/validation`,
          method: 'PUT',
          body: body,
          headers: {
            'Accept': 'application/ld+json',
            'Content-Type': 'application/ld+json',
            'Authorization': `bearer ${token}`
          }
        }
      },
      invalidatesTags: (result, error) => [{ type: 'Questions', id: result.question.id }],
    }),
    deleteAnswer: builder.mutation({
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
      invalidatesTags: (result, error) => [{ type: 'Questions', id: result.question.id }],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useAddAnswerMutation, useUpdateAnswerMutation, useDeleteAnswerMutation, useValidateAnswerMutation } = answerApi