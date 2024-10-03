import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import WithRouter from './containers/WithRouter';
import Private from './containers/Private';
import Layout from './containers/Layout';

const Login = React.lazy(() => import('./pages/Login'));
const News = React.lazy(() => import('./pages/News'));
const Products = React.lazy(() => import('./pages/Products'));
const Home = React.lazy(() => import('./pages/Home'));
const Category = React.lazy(() => import('./pages/Category'));
const Banner = React.lazy(() => import('./pages/Banner'));
const Order = React.lazy(() => import('./pages/Order'));
const Users = React.lazy(() => import('./pages/Users'));

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/auth" /> },
  {
    path: '/auth',
    element: (
      <WithRouter>
        <Login />
      </WithRouter>
    ),
  },
  {
    path: '/admin',
    element: (
      <Private>
        <Layout />
      </Private>
    ),
    children: [
      {
        index: true,
        element: (
          <WithRouter>
            <Home />
          </WithRouter>
        ),
      },
      {
        path: 'product',
        id: 'product',
        element: (
          <WithRouter>
            <Products />
          </WithRouter>
        ),
      },
      {
        path: 'category',
        id: 'category',
        element: (
          <WithRouter>
            <Category />
          </WithRouter>
        ),
      },
      {
        path: 'news',
        id: 'news',
        element: (
          <WithRouter>
            <News />
          </WithRouter>
        ),
      },
      {
        path: 'banner',
        id: 'banner',
        element: (
          <WithRouter>
            <Banner />
          </WithRouter>
        ),
      },
      {
        path: 'order',
        element: (
          <WithRouter>
            <Order />
          </WithRouter>
        ),
      },
      {
        path: 'users',
        element: (
          <WithRouter>
            <Users />
          </WithRouter>
        ),
      },
    ],
  },
]);
