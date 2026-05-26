import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const Dashboard = () => {
  const user = useStore((state) => state.user);
  const resume = useStore((state) => state.resume);
  const aiScore = useStore((state) => state.aiScore);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const getScoreColor = (score: number | undefined) => {
    if (!score) return 'var(--muted)';
    if (score >= 76) return 'var(--green)';
    if (score >= 51) return '#FFD700';
    return '#FF006E';
  };

  const completeness = resume
    ? Math.round(
        ((resume.full_name ? 1 : 0) +
          (resume.email ? 1 : 0) +
          (resume.title ? 1 : 0) +
          (resume.summary ? 1 : 0) +
          (resume.experience?.length > 0 ? 1 : 0) +
          (resume.skills?.length > 0 ? 1 : 0)) /
          6 *
          100
      )
    : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
      {/* Background Grid */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(0,255,148,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,148,0.025) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Top Nav Bar */}
      <div
        style={{
          height: '60px',
          background: 'rgba(10,10,26,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,255,148,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Left - Logo */}
        <div
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: '14px',
            color: 'var(--green)',
            fontWeight: 700,
          }}
        >
          ◈ CHAINRESUME
        </div>

        {/* Center - Nav Links */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['RESUME', 'SCORE', '3D CARD', 'BLOCKCHAIN'].map((link, idx) => (
            <button
              key={link}
              onClick={() => {
                if (link === 'RESUME') navigate('/builder');
                if (link === 'SCORE') navigate('/score');
                if (link === '3D CARD') navigate('/card');
              }}
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '11px',
                color: idx === 0 ? 'white' : 'var(--muted)',
                letterSpacing: '0.1em',
                padding: '6px 16px',
                cursor: 'pointer',
                background: idx === 0 ? 'rgba(0,255,148,0.08)' : 'transparent',
                border: 'none',
                borderRadius: '2px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.background = 'rgba(0,255,148,0.08)';
              }}
              onMouseLeave={(e) => {
                if (idx !== 0) {
                  e.currentTarget.style.color = 'var(--muted)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {link}
            </button>
          ))}
        </div>

        {/* Right - User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Notification Bell */}
          <div style={{ fontSize: '18px', cursor: 'pointer', opacity: 0.6 }}>🔔</div>

          {/* Wallet Status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '4px',
              fontSize: '11px',
              fontFamily: 'JetBrains Mono',
            }}
          >
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#666680',
              }}
            />
            <span style={{ color: 'var(--muted)' }}>Not Connected</span>
          </div>

          {/* User Avatar */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--green)',
              color: '#020208',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '14px',
            }}
          >
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>

      {/* Main Content - CRITICAL FIX: Added padding-left */}
      <div style={{ padding: '32px 32px 32px 32px', position: 'relative', zIndex: 1 }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: '11px',
              color: 'var(--muted)',
              letterSpacing: '0.15em',
              marginBottom: '8px',
            }}
          >
            GOOD EVENING,
          </div>
          <h1
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: '40px',
              fontWeight: 700,
              color: 'white',
            }}
          >
            {user?.email || 'User'}
          </h1>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {/* Card 1 - AI Score */}
          <div
            style={{
              background: 'var(--bg2)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0,255,148,0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Corner Glow */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '80px',
                height: '80px',
                background:
                  'radial-gradient(circle at top right, rgba(0,255,148,0.08), transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            {/* Icon */}
            <div style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '24px' }}>
              🤖
            </div>

            {/* Content */}
            <div
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '10px',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              AI SCORE
            </div>
            <div
              style={{
                fontFamily: 'Space Grotesk',
                fontSize: '48px',
                fontWeight: 700,
                color: getScoreColor(aiScore?.overall_score),
                textShadow: `0 0 20px ${getScoreColor(aiScore?.overall_score)}`,
                marginBottom: '8px',
              }}
            >
              {aiScore?.overall_score || '--'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Resume Intelligence</div>
          </div>

          {/* Card 2 - Profile Views */}
          <div
            style={{
              background: 'var(--bg2)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '80px',
                height: '80px',
                background:
                  'radial-gradient(circle at top right, rgba(0,212,255,0.08), transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '24px' }}>
              👁
            </div>
            <div
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '10px',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              PROFILE VIEWS
            </div>
            <div
              style={{
                fontFamily: 'Space Grotesk',
                fontSize: '48px',
                fontWeight: 700,
                color: 'var(--blue)',
                marginBottom: '8px',
              }}
            >
              0
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Total Impressions</div>
          </div>

          {/* Card 3 - On-Chain Status */}
          <div
            style={{
              background: 'var(--bg2)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '80px',
                height: '80px',
                background:
                  'radial-gradient(circle at top right, rgba(124,58,237,0.08), transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '24px' }}>
              ⛓
            </div>
            <div
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '10px',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              ON-CHAIN STATUS
            </div>
            <div
              style={{
                fontFamily: 'Space Grotesk',
                fontSize: '32px',
                fontWeight: 700,
                color: resume ? 'var(--muted)' : 'var(--muted)',
                marginBottom: '8px',
              }}
            >
              {resume ? 'PENDING' : 'NOT MINTED'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Blockchain Status</div>
          </div>

          {/* Card 4 - Profile Complete */}
          <div
            style={{
              background: 'var(--bg2)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '24px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,215,0,0.3)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '80px',
                height: '80px',
                background:
                  'radial-gradient(circle at top right, rgba(255,215,0,0.08), transparent 70%)',
                pointerEvents: 'none',
              }}
            />
            <div style={{ position: 'absolute', top: '24px', right: '24px', fontSize: '24px' }}>
              📊
            </div>
            <div
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '10px',
                color: 'var(--muted)',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              COMPLETENESS
            </div>
            <div
              style={{
                fontFamily: 'Space Grotesk',
                fontSize: '48px',
                fontWeight: 700,
                color: 'var(--gold)',
                marginBottom: '8px',
              }}
            >
              {completeness}%
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Profile Complete</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: '11px',
              color: 'var(--muted)',
              letterSpacing: '0.15em',
              marginBottom: '16px',
            }}
          >
            QUICK ACTIONS
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}
          >
            {/* Action A - Build Resume */}
            <div
              onClick={() => navigate('/builder')}
              style={{
                background: 'var(--bg2)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '28px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = 'rgba(0,255,148,0.4)';
                e.currentTarget.style.boxShadow =
                  '0 0 0 1px rgba(0,255,148,0.2), 0 16px 40px rgba(0,0,0,0.4), 0 0 60px rgba(0,255,148,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
              <h3
                style={{
                  fontFamily: 'Space Grotesk',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                BUILD RESUME
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
                Create your verified identity
              </p>
              <div
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  color: 'rgba(0,255,148,0.5)',
                  fontSize: '20px',
                }}
              >
                →
              </div>
            </div>

            {/* Action B - Get AI Score */}
            <div
              onClick={async () => {
                if (!resume) return;
                try {
                  const response = await fetch(`${API_URL}/api/resume/score`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(resume),
                  });
                  if (response.ok) {
                    navigate('/score');
                  }
                } catch (error) {
                  console.error('Scoring error:', error);
                }
              }}
              style={{
                background: 'var(--bg2)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '28px',
                cursor: resume ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                position: 'relative',
                overflow: 'hidden',
                opacity: resume ? 1 : 0.5,
              }}
              onMouseEnter={(e) => {
                if (resume) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)';
                  e.currentTarget.style.boxShadow =
                    '0 0 0 1px rgba(0,212,255,0.2), 0 16px 40px rgba(0,0,0,0.4), 0 0 60px rgba(0,212,255,0.06)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🤖</div>
              <h3
                style={{
                  fontFamily: 'Space Grotesk',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                GET AI SCORE
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
                Analyze with intelligence
              </p>
              <div
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  color: 'rgba(0,212,255,0.5)',
                  fontSize: '20px',
                }}
              >
                →
              </div>
            </div>

            {/* Action C - View 3D Card */}
            <div
              onClick={() => resume && navigate('/card')}
              style={{
                background: 'var(--bg2)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '28px',
                cursor: resume ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                position: 'relative',
                overflow: 'hidden',
                opacity: resume ? 1 : 0.5,
              }}
              onMouseEnter={(e) => {
                if (resume) {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)';
                  e.currentTarget.style.boxShadow =
                    '0 0 0 1px rgba(124,58,237,0.2), 0 16px 40px rgba(0,0,0,0.4), 0 0 60px rgba(124,58,237,0.06)';
                  e.currentTarget.style.animation = 'borderGlow 2s ease infinite';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.animation = 'none';
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌐</div>
              <h3
                style={{
                  fontFamily: 'Space Grotesk',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                VIEW 3D CARD
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
                Your holographic identity
              </p>
              <div
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  color: 'rgba(124,58,237,0.5)',
                  fontSize: '20px',
                }}
              >
                →
              </div>
            </div>

            {/* Action D - Mint On-Chain */}
            <div
              style={{
                background: 'var(--bg2)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '28px',
                cursor: 'not-allowed',
                transition: 'all 0.3s',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                position: 'relative',
                overflow: 'hidden',
                opacity: 0.7,
              }}
            >
              {/* Phase 4 Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255,0,110,0.1)',
                  border: '1px solid rgba(255,0,110,0.3)',
                  padding: '4px 8px',
                  borderRadius: '2px',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '9px',
                  color: 'var(--pink)',
                  letterSpacing: '0.1em',
                }}
              >
                PHASE 4
              </div>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>⛓</div>
              <h3
                style={{
                  fontFamily: 'Space Grotesk',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: 'white',
                }}
              >
                MINT ON-CHAIN
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--muted)' }}>
                Secure on Polygon blockchain
              </p>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div>
          <div
            style={{
              fontFamily: 'JetBrains Mono',
              fontSize: '11px',
              color: 'var(--muted)',
              letterSpacing: '0.15em',
              marginBottom: '16px',
            }}
          >
            RECENT ACTIVITY
          </div>

          <div
            style={{
              background: 'var(--bg2)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '24px',
            }}
          >
            {/* Activity Item 1 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--green)',
                  boxShadow: '0 0 8px var(--green)',
                }}
              />
              <span style={{ fontSize: '14px', color: 'white' }}>
                Account created successfully
              </span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: '11px',
                  color: 'var(--muted)',
                  marginLeft: 'auto',
                }}
              >
                just now
              </span>
            </div>

            {/* Activity Item 2 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '12px 0',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--blue)',
                  boxShadow: '0 0 8px var(--blue)',
                }}
              />
              <span style={{ fontSize: '14px', color: 'white' }}>Welcome to ChainResume</span>
              <span
                style={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: '11px',
                  color: 'var(--muted)',
                  marginLeft: 'auto',
                }}
              >
                today
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
