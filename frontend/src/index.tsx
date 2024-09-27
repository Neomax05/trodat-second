import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import './index.css';
import Notification from './contexts/Notification';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Notification.Provider value={{ name: 'Ant Design' }}>
      <RouterProvider router={router} />
    </Notification.Provider>
  </React.StrictMode>
);
