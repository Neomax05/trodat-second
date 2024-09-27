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
    path: '/',
    element: (
      <Private>
        <Layout />
      </Private>
    ),
    id: 'admin',
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
    ],
  },
]);
