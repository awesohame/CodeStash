import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { Toaster } from 'react-hot-toast';
// layout
import RootLayout from './layouts/RootLayout.jsx'

// pages
import Home from './pages/Home.jsx'
import CreateStash from './pages/CreateStash.jsx'
import Profile from './pages/Profile.jsx';
import CreateCollection from './pages/CreateCollection.jsx';

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
        path: "search",
        element: <div>Search Page</div>,
      },
      {
        path: "create-stash",
        element: <CreateStash />,
      },
      {
        path: "u",
        element: <Outlet />,
        children: [
          {
            path: ":username",
            element: <Profile />,
          },
          {
            path: "settings",
            element: <div>Settings Page</div>,
          }
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
          },
          {
            path: "create-collection",
            element: <CreateCollection />,
          }
        ],
      },
      {
        path: "help",
        element: <Outlet />,
        children: [
          {
            path: "suggestions",
            element: <div>Suggestions Page</div>,
          },
          {
            path: "contact",
            element: <div>Contact Page</div>,
          },
          {
            path: "about",
            element: <div>About Page</div>,
          }
        ]
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>

  </React.StrictMode>,
)
