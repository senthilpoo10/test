import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
// import { getGoogleAuthUrl } from '../../services/auth.api';

export const GoogleAuthButton = () => {
  const navigate = useNavigate();

  // const handleGoogleAuth = async () => {
  //   try {
  //     const { url } = await getGoogleAuthUrl();
  //     window.location.href = url;
  //   } catch (error) {
  //     console.error('Google auth error:', error);
  //   }
  // };

  return (
    <div className="mt-4">
      <GoogleLogin
        onSuccess={() => navigate('/tournament')}
        onError={() => console.log('Login Failed')}
        useOneTap
      />
    </div>
  );
};