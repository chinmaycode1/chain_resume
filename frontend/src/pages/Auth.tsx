import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useStore } from '../store/useStore';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email!,
          });
          navigate('/dashboard');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              email: email,
            }
          },
        });

        if (error) throw error;

        if (data.user) {
          // Check if email confirmation is required
          if (data.session) {
            // User is immediately logged in (email confirmation disabled)
            setUser({
              id: data.user.id,
              email: data.user.email!,
            });
            navigate('/builder');
          } else {
            // Email confirmation required
            setError('Success! Please check your email to confirm your account, then sign in.');
            setIsLogin(true); // Switch to login mode
          }
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      console.error('Error details:', {
        message: err.message,
        status: err.status,
        statusText: err.statusText,
        name: err.name
      });
      
      let errorMessage = err.message || 'Authentication failed. Please check your credentials.';
      
      // Provide more helpful error messages
      if (err.message?.includes('Invalid API key')) {
        errorMessage = 'Invalid Supabase configuration. Please check your API keys in the .env file.';
      } else if (err.message?.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and confirm your account before signing in.';
      } else if (err.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (err.message?.includes('User already registered')) {
        errorMessage = 'This email is already registered. Please sign in instead.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(err.message || 'Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
      }}
    >
      {/* Background Layer */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background:
            'radial-gradient(ellipse at 20% 50%, #0D1B0D 0%, #020208 50%, #05050F 100%)',
        }}
      >
        {/* Animated Grid */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,255,148,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,148,0.04) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite',
          }}
        />

        {/* Glowing Orbs */}
        <div
          style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            left: '-200px',
            top: '-200px',
            background:
              'radial-gradient(circle, rgba(0,255,148,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            right: '-100px',
            bottom: '-100px',
            background:
              'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Left Side - Hidden on mobile */}
      <div
        style={{
          flex: '0 0 50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '0 80px',
          position: 'relative',
          zIndex: 1,
        }}
        className="hidden md:flex"
      >
        <div style={{ fontSize: '80px', color: 'var(--green)', marginBottom: '16px' }}>
          ◈
        </div>
        <h1
          style={{
            fontFamily: 'Space Grotesk',
            fontSize: '48px',
            fontWeight: 700,
            color: 'white',
            marginBottom: '8px',
          }}
        >
          CHAINRESUME
        </h1>
        <p
          style={{
            fontSize: '18px',
            color: 'var(--muted)',
            marginBottom: '32px',
          }}
        >
          Your resume. Verified forever.
        </p>

        <div
          style={{
            width: '60px',
            height: '1px',
            background: 'var(--border)',
            marginBottom: '32px',
          }}
        />

        {/* Feature Pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <span style={{ fontSize: '20px' }}>⛓</span>
            <span style={{ fontSize: '14px', color: 'var(--muted)' }}>
              Blockchain verified credentials
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <span style={{ fontSize: '20px' }}>🤖</span>
            <span style={{ fontSize: '14px', color: 'var(--muted)' }}>
              AI-powered resume scoring
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <span style={{ fontSize: '20px' }}>🌐</span>
            <span style={{ fontSize: '14px', color: 'var(--muted)' }}>
              3D holographic card
            </span>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '32px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: '440px',
            maxWidth: '100%',
            background: 'rgba(10,10,26,0.8)',
            border: '1px solid rgba(0,255,148,0.2)',
            borderRadius: '8px',
            backdropFilter: 'blur(20px)',
            boxShadow:
              '0 0 0 1px rgba(0,255,148,0.05), 0 24px 64px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,255,148,0.02)',
            padding: '48px',
          }}
        >
          {/* Top Tag */}
          <div
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: '10px',
              color: 'var(--green)',
              letterSpacing: '0.2em',
              background: 'rgba(0,255,148,0.08)',
              border: '1px solid rgba(0,255,148,0.2)',
              padding: '4px 12px',
              borderRadius: '2px',
              display: 'inline-block',
              marginBottom: '24px',
            }}
          >
            SECURE LOGIN
          </div>

          {/* Heading */}
          <h2
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: '32px',
              fontWeight: 700,
              color: 'white',
              marginBottom: '8px',
            }}
          >
            {isLogin ? 'Welcome back' : 'Create account'}
          </h2>
          <p
            style={{
              fontSize: '14px',
              color: 'var(--muted)',
              marginBottom: '32px',
            }}
          >
            {isLogin ? 'Sign in to your chain identity' : 'Start your verified journey'}
          </p>

          {/* Form */}
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email Input */}
            <div>
              <label
                style={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: '10px',
                  color: 'var(--muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'white',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  WebkitTextFillColor: '#ffffff',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--green)';
                  e.target.style.background = 'rgba(0,255,148,0.04)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0,255,148,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.target.style.background = 'rgba(255,255,255,0.04)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password Input */}
            <div>
              <label
                style={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: '10px',
                  color: 'var(--muted)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '6px',
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                  color: 'white',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  WebkitTextFillColor: '#ffffff',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--green)';
                  e.target.style.background = 'rgba(0,255,148,0.04)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0,255,148,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.target.style.background = 'rgba(255,255,255,0.04)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  padding: '12px',
                  background: 'rgba(255,0,0,0.1)',
                  border: '1px solid rgba(255,0,0,0.3)',
                  borderRadius: '4px',
                }}
              >
                <p
                  style={{
                    color: '#ff4444',
                    fontSize: '13px',
                    fontFamily: 'JetBrains Mono',
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '15px',
                background: 'linear-gradient(135deg, #00FF94 0%, #00CC77 100%)',
                color: '#020208',
                fontFamily: 'Space Grotesk',
                fontWeight: 700,
                fontSize: '15px',
                letterSpacing: '0.05em',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: '8px',
                position: 'relative',
                overflow: 'hidden',
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 0 40px rgba(0,255,148,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>
                {loading ? 'PROCESSING...' : isLogin ? 'SIGN IN' : 'SIGN UP'}
              </span>
              {!loading && (
                <span
                  style={{
                    content: '',
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.5s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(100%)';
                  }}
                />
              )}
            </button>
          </form>

          {/* OR Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              margin: '24px 0',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: '11px', color: 'var(--muted)' }}>
              OR
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            type="button"
            style={{
              width: '100%',
              padding: '14px',
              background: 'white',
              border: 'none',
              borderRadius: '4px',
              fontFamily: 'Space Grotesk',
              fontWeight: 600,
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              color: '#1f1f1f',
              opacity: loading ? 0.7 : 1,
              marginBottom: '12px',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
              <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Connect Wallet Button */}
          <div style={{ width: '100%' }}>
            <ConnectButton.Custom>
              {({ account, openConnectModal }) => {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    style={{
                      width: '100%',
                      padding: '14px',
                      background: 'transparent',
                      border: '1px solid rgba(124,58,237,0.5)',
                      color: '#A78BFA',
                      borderRadius: '4px',
                      fontFamily: 'Space Grotesk',
                      fontWeight: 600,
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(124,58,237,0.1)';
                      e.currentTarget.style.borderColor = 'var(--purple)';
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(124,58,237,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {account ? `Connected: ${account.displayName}` : 'CONNECT WALLET'}
                  </button>
                );
              }}
            </ConnectButton.Custom>
          </div>

          {/* Bottom Link */}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
                color: 'var(--muted)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <span style={{ color: 'var(--green)' }}>
                {isLogin ? 'Sign up' : 'Sign in'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
