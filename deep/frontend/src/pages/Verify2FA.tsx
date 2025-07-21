import { Header } from '../components/Layout/Header';
import { Verify2FAForm } from '../components/Auth/Verify2FAForm';

export const Verify2FA = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto p-4">
        <Verify2FAForm />
      </main>
    </div>
  );
};