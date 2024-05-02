import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.REACT_APP_URL}api/notifications` }),
  endpoints: (builder) => ({
    getNotification: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Notification', id }] 
    }),
    getNotifications: builder.query({
      query(parameters) {
        const { filter, token} = parameters;
        return {
          url: `${filter}`,
          headers: {
            'Authorization': `bearer ${token}`
          }
        }
      },
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetNotificationQuery, useGetNotificationsQuery } = notificationApi