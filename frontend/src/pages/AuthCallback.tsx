import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          navigate('/auth');
          return;
        }

        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
          });
          navigate('/dashboard');
        } else {
          navigate('/auth');
        }
      } catch (err) {
        console.error('Callback error:', err);
        navigate('/auth');
      }
    };

    handleCallback();
  }, [navigate, setUser]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontSize: '48px',
            color: 'var(--green)',
            marginBottom: '16px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        >
          ◈
        </div>
        <p
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: '14px',
            color: 'var(--muted)',
          }}
        >
          Completing sign in...
        </p>
      </div>
    </div>
  );
};
