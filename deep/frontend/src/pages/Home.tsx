import { Header } from '../components/Layout/Header';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md mt-10 text-center">
          <h1 className="text-3xl font-bold mb-6">Welcome to 2FA App</h1>
          <div className="space-y-4">
            <Link
              to="/register"
              className="block w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="block w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};