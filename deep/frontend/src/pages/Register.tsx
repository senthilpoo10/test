import { Header } from '../components/Layout/Header';
import { RegisterForm } from '../components/Auth/RegisterForm';

export const Register = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-4">
        <RegisterForm />
        <div className="max-w-md mx-auto mt-4 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

