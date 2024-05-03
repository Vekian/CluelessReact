import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_URL}api/notifications` }),
  endpoints: (builder) => ({
    updateNotification: builder.mutation({
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
        invalidatesTags: (result, error, id) => [{ type: 'Comments', id }],
      }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useUpdateNotificationMutation } = notificationApi