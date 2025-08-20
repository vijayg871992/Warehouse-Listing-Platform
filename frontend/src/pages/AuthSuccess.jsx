import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthSuccess = () => {
  console.log('AuthSuccess component loaded!');
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  
  console.log('AuthSuccess - Current URL:', window.location.href);
  console.log('AuthSuccess - Hash:', window.location.hash);

  useEffect(() => {
    const handleAuthSuccess = () => {
      // Parse URL parameters from the part after the route in the hash
      const hashParts = window.location.hash.split('?');
      const urlParams = hashParts.length > 1 ? new URLSearchParams(hashParts[1]) : new URLSearchParams();
      
      const token = urlParams.get('token');
      const refreshToken = urlParams.get('refresh');
      const userString = urlParams.get('user');
      const redirectPath = urlParams.get('redirectPath') || '/user/dashboard';

      console.log('AuthSuccess - Parsed params:', { token: !!token, refreshToken: !!refreshToken, userString: !!userString, redirectPath });

      if (token && userString) {
        try {
          const user = JSON.parse(decodeURIComponent(userString));
          
          // Store tokens and user data
          localStorage.setItem('accessToken', token);
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }
          localStorage.setItem('user', JSON.stringify(user));

          console.log('AuthSuccess - Stored user data:', user);

          // Update auth context
          dispatch({ type: 'SET_USER', payload: user });

          // Navigate to appropriate page
          const destination = user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
          console.log('AuthSuccess - Navigating to:', destination);
          
          // Small delay to ensure state updates
          setTimeout(() => {
            navigate(destination, { replace: true });
          }, 100);
        } catch (error) {
          console.error('Error parsing OAuth response:', error);
          navigate('/login?error=oauth_parse_failed', { replace: true });
        }
      } else {
        console.error('Missing OAuth parameters');
        navigate('/login?error=oauth_missing_params', { replace: true });
      }
    };

    handleAuthSuccess();
  }, [navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Completing Sign In...
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please wait while we finish setting up your account.
          </p>
          <div className="mt-4 text-xs text-gray-400">
            Current URL: {window.location.href}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Hash: {window.location.hash}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccess;