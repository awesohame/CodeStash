import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.js';

// layout
import RootLayout from './layouts/RootLayout.jsx'

// pages
import Home from './pages/Home.jsx'

import { Outlet } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: ":stashSlug",
        element: <div>StashPage <Outlet /></div>,
        children: [
          {
            path: "update",
            element: <div>UpdateStashPage</div>,
          }
        ]
      },
      {
        path: "public",
        element: <div>Public Stashes Page</div>,
      },
      {
        path: "u",
        element: <Outlet />,
        children: [
          {
            path: ":username",
            element: <div>User Profile Page</div>,
          },
        ],
      },
      {
        path: "c",
        element: <Outlet />,
        children: [
          {
            path: ":collectionSlug",
            element: <div>Collection view Page</div>,
          },
          {
            path: "public",
            element: <div>Public Collections Page</div>,
          }
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>

  </React.StrictMode>,
)
