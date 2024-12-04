import './App.css';
import * as React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import LoginPage from './pages/Public/Login/Login';
import RegisterPage from './pages/Public/Register/Register';
import MainPage from './pages/Main/Main';
import Movie from './pages/Main/Movie/Movie';
import Lists from './pages/Main/Movie/Lists/Lists';
import Form from './pages/Main/Movie/Form/Form';
import Dashboard from './pages/Main/Dashboard/Dashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/main',
    element: <MainPage />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'movies',
        element: <Movie />,
        children: [
          {
            index: true,
            element: <Lists />,
          },
          {
            path: 'form/:movieId?',
            element: <Form />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
