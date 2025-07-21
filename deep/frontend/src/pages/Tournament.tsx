import { Header } from '../components/Layout/Header';
import { Link } from 'react-router-dom';

export const Tournament = () => {
  // In a real app, you would get the username from auth context or state
  const username = "JohnDoe"; // This should come from your auth state

  return (
    <div className="min-h-screen bg-gray-100">
      <Header username={username} />
      <main className="container mx-auto p-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-3xl font-bold mb-6">Welcome to Tournament</h1>
          <p className="mb-6">Hello, {username}! You're now logged in.</p>
          <Link
            to="/tournament"
            className="block w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Tournament
          </Link>
        </div>
      </main>
    </div>
  );
};