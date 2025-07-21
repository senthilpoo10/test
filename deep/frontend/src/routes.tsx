import { createBrowserRouter } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Tournament } from './pages/Tournament';
import { Verify2FA } from './pages/Verify2FA';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/verify-2fa',
    element: <Verify2FA />,
  },
  {
    path: '/tournament',
    element: <Tournament />,
  },
]);