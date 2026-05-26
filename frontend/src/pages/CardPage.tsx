import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useAccount } from 'wagmi';
import ResumeCardScene from '../components/3d/ResumeCardScene';
import { QRCodeSVG } from 'qrcode.react';

export default function CardPage() {
  const navigate = useNavigate();
  const resume = useStore((state) => state.resume);
  const { address } = useAccount();
  const [isFlipped, setIsFlipped] = useState(false);
  const [theme, setTheme] = useState('#00FF94'); // Cyber Green default

  const themes = [
    { name: 'Cyber Green', color: '#00FF94' },
    { name: 'Ocean Blue', color: '#00D4FF' },
    { name: 'Purple Rain', color: '#7C3AED' },
    { name: 'Gold Rush', color: '#FFD700' },
  ];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    // TODO: Trigger flip animation in 3D scene
  };

  const handleDownloadPNG = () => {
    alert('PNG export coming soon!');
  };

  const handleShare = () => {
    const url = `${window.location.origin}/verify/${address || 'demo'}`;
    navigator.clipboard.writeText(url);
    alert('Profile URL copied to clipboard!');
  };

  // No resume state
  if (!resume) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: '#020208',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            background: 'rgba(10,10,26,0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,255,148,0.2)',
            borderRadius: '8px',
            padding: '48px',
            textAlign: 'center',
            maxWidth: '400px',
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>📝</div>
          <h2
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: '24px',
              fontWeight: 700,
              color: 'white',
              marginBottom: '12px',
            }}
          >
            BUILD YOUR RESUME FIRST
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>
            Create your resume to see it as a 3D holographic card
          </p>
          <button
            onClick={() => navigate('/builder')}
            style={{
              width: '100%',
              padding: '14px',
              fontFamily: 'Space Grotesk',
              fontSize: '14px',
              fontWeight: 700,
              color: '#020208',
              background: 'linear-gradient(135deg, #00FF94 0%, #00CC77 100%)',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0,255,148,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            GO TO RESUME BUILDER →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#020208',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* Left Panel - 3D Scene (55% on desktop) */}
      <div
        style={{
          flex: '0 0 55%',
          height: '100vh',
          position: 'relative',
        }}
        className="card-scene-panel"
      >
        {/* Scanline overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,255,148,0.02) 1px, transparent 1px)',
            backgroundSize: '100% 4px',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />

        {/* 3D Scene Container - CRITICAL: Must have viewport height */}
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
          <ResumeCardScene />
        </div>

        {/* Hint Text */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'JetBrains Mono',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            zIndex: 20,
          }}
        >
          DRAG • SCROLL • CLICK TO FLIP
        </div>
      </div>

      {/* Right Panel - Controls (45% on desktop) */}
      <div
        style={{
          flex: '0 0 45%',
          height: '100vh',
          background: 'var(--bg2)',
          borderLeft: '1px solid rgba(0,255,148,0.1)',
          padding: '40px 32px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
        }}
        className="card-controls-panel"
      >
        {/* Header */}
        <div>
          <div
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: '10px',
              color: 'var(--muted)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            YOUR CHAIN CARD
          </div>
          <h1
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: '32px',
              fontWeight: 700,
              color: 'white',
              marginBottom: '8px',
            }}
          >
            {resume.full_name || 'Your Name'}
          </h1>
          {address && (
            <div
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
                color: 'var(--muted)',
              }}
            >
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          )}
        </div>

        {/* Verification Badge */}
        <div
          style={{
            padding: '16px',
            background: address
              ? 'rgba(0,255,148,0.05)'
              : 'rgba(255,255,255,0.02)',
            border: `1px solid ${
              address ? 'rgba(0,255,148,0.2)' : 'rgba(255,255,255,0.06)'
            }`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: address ? 'var(--green)' : 'rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}
          >
            {address ? '✓' : '○'}
          </div>
          <div>
            <div
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
                fontWeight: 700,
                color: address ? 'var(--green)' : 'var(--muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {address ? 'ON-CHAIN VERIFIED' : 'NOT MINTED'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
              {address ? 'Polygon Amoy Testnet' : 'Connect wallet to mint'}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleFlip}
            style={{
              width: '100%',
              padding: '14px',
              fontFamily: 'Space Grotesk',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--blue)',
              background: 'transparent',
              border: '1px solid rgba(0,212,255,0.5)',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0,212,255,0.1)';
              e.currentTarget.style.borderColor = 'var(--blue)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            FLIP CARD ↺
          </button>

          <button
            onClick={handleDownloadPNG}
            style={{
              width: '100%',
              padding: '14px',
              fontFamily: 'Space Grotesk',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--green)',
              background: 'transparent',
              border: '1px solid rgba(0,255,148,0.5)',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0,255,148,0.1)';
              e.currentTarget.style.borderColor = 'var(--green)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0,255,148,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(0,255,148,0.5)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            DOWNLOAD PNG ↓
          </button>

          <button
            disabled
            style={{
              width: '100%',
              padding: '14px',
              fontFamily: 'Space Grotesk',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--muted)',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              cursor: 'not-allowed',
              opacity: 0.5,
              position: 'relative',
            }}
          >
            MINT ON CHAIN ⛓
            <span
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'rgba(255,0,110,0.1)',
                border: '1px solid rgba(255,0,110,0.3)',
                padding: '2px 6px',
                borderRadius: '2px',
                fontFamily: 'JetBrains Mono',
                fontSize: '9px',
                color: 'var(--pink)',
                letterSpacing: '0.1em',
              }}
            >
              PHASE 4
            </span>
          </button>

          <button
            onClick={handleShare}
            style={{
              width: '100%',
              padding: '14px',
              fontFamily: 'Space Grotesk',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--pink)',
              background: 'transparent',
              border: '1px solid rgba(255,0,110,0.5)',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,0,110,0.1)';
              e.currentTarget.style.borderColor = 'var(--pink)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255,0,110,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255,0,110,0.5)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            SHARE CARD ↗
          </button>
        </div>

        {/* Theme Selector */}
        <div>
          <div
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: '10px',
              color: 'var(--muted)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            THEME
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {themes.map((t) => (
              <button
                key={t.color}
                onClick={() => setTheme(t.color)}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: t.color,
                  border: theme === t.color ? '3px solid white' : '2px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: theme === t.color ? `0 0 20px ${t.color}` : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title={t.name}
              />
            ))}
          </div>
        </div>

        {/* QR Code Section */}
        {address && (
          <div>
            <div
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '10px',
                color: 'var(--muted)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              VERIFICATION QR
            </div>
            <div
              style={{
                padding: '16px',
                background: 'white',
                borderRadius: '8px',
                display: 'inline-block',
              }}
            >
              <QRCodeSVG
                value={`${window.location.origin}/verify/${address}`}
                size={100}
                bgColor="transparent"
                fgColor="#00FF94"
                level="H"
              />
            </div>
            <div
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '10px',
                color: 'var(--muted)',
                marginTop: '8px',
              }}
            >
              SCAN TO VERIFY ON-CHAIN
            </div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            marginTop: 'auto',
            padding: '12px',
            fontFamily: 'JetBrains Mono',
            fontSize: '11px',
            color: 'var(--muted)',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--muted)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
          }}
        >
          ← BACK TO DASHBOARD
        </button>
      </div>

      {/* Mobile Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          .card-scene-panel {
            flex: 0 0 100% !important;
            height: 45vh !important;
          }
          .card-controls-panel {
            flex: 0 0 100% !important;
            height: 55vh !important;
            border-left: none !important;
            border-top: 1px solid rgba(0,255,148,0.1) !important;
          }
        }
      `}</style>
    </div>
  );
}
