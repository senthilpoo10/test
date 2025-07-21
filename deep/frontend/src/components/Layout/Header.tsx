import { Link } from 'react-router-dom';

export const Header = ({ username }: { username?: string }) => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          2FA App
        </Link>
        <nav>
          {username ? (
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {username}
              </span>
              <Link
                to="/logout"
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </Link>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/register"
                className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
              >
                Login
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};