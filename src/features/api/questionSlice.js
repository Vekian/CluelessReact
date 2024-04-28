import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const questionApi = createApi({
  reducerPath: 'questionApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_URL}api/questions` }),
  endpoints: (builder) => ({
    getQuestion: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Questions', id }] 
    }),
    getQuestions: builder.query({
      query(parameters) {
        const { page, filter} = parameters;
        return {
          url: `${filter}${page}`,
        }
      },
    }),
    addQuestion: builder.mutation({
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
      invalidatesTags: (result, error, { id }) => [{ type: 'Questions', id }],
    }),
    updateQuestion: builder.mutation({
      query(data) {
        const { id, token, body } = data
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
      invalidatesTags: (result, error, { id }) => [{ type: 'Questions', id }],
    }),
    deleteQuestion: builder.mutation({
      query(data) {
        const { id, token } = data
        return {
          url: `/${id}`,
          method: 'DELETE',
          headers: {
            'Authorization': `bearer ${token}`
          }
        }
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      invalidatesTags: (result, error, id) => [{ type: 'Questions', id }],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetQuestionQuery, useGetQuestionsQuery, useAddQuestionMutation, useUpdateQuestionMutation, useDeleteQuestionMutation } = questionApi