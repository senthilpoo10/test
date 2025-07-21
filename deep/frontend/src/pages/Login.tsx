import { Header } from '../components/Layout/Header';
import { LoginForm } from '../components/Auth/LoginForm';
import { GoogleAuthButton } from '../components/Auth/GoogleAuthButton';
import { useLocation } from 'react-router-dom';

export const Login = () => {
  const { state } = useLocation();
  const registrationSuccess = state?.registrationSuccess;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-4">
        {registrationSuccess && (
          <div className="max-w-md mx-auto mb-4 p-4 bg-green-100 text-green-700 rounded">
            Registration successful! Please login.
          </div>
        )}
        <LoginForm />
        <div className="max-w-md mx-auto mt-4 text-center">
          <p className="text-gray-600 mb-2">Or login with</p>
          <GoogleAuthButton />
        </div>
        <div className="max-w-md mx-auto mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};