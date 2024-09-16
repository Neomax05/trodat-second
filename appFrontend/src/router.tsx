import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import WithRouter from './containers/WithRouter';
import Layout from './containers/Layout';
import ErrorFallback from './components/ErrorFallBack';


const Home = React.lazy(() => import('./pages/Home'));


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,  
    errorElement: <ErrorFallback />,
    children: [
      {
        path: '',
        id: 'home',
        element: (
          <WithRouter>
            <Home />
          </WithRouter>
        ),
      },

    ],
  },
]);
