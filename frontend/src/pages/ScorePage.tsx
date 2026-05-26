import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ScoreDisplay } from '../components/scoring/ScoreDisplay';
import { BulletFeedback } from '../components/scoring/BulletFeedback';
import { RoastMode } from '../components/scoring/RoastMode';
import { PolishMode } from '../components/scoring/PolishMode';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

type TabType = 'feedback' | 'roast' | 'polish';

interface ScoreData {
  overall_score: number;
  categories: {
    ats_compatibility: { score: number; label: string };
    impact_language: { score: number; label: string };
    skill_relevance: { score: number; label: string };
    completeness: { score: number; label: string };
  };
  bullet_feedback: Array<{
    original: string;
    issue: string;
    suggestion: string;
    severity: 'high' | 'medium' | 'low';
  }>;
  roast: string;
  strengths: string[];
  quick_wins: string[];
}

export const ScorePage = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRescoring, setIsRescoring] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('feedback');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchScore();
  }, [user, resumeId, navigate]);

  const fetchScore = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_URL}/api/resume/${resumeId || user?.id}/latest-score`
      );

      if (response.ok) {
        const data = await response.json();
        setScoreData({
          overall_score: data.overall_score,
          categories: data.categories_json,
          bullet_feedback: data.bullet_feedback_json,
          roast: data.roast_text,
          strengths: data.strengths,
          quick_wins: data.quick_wins,
        });
      } else {
        console.error('No score found');
      }
    } catch (error) {
      console.error('Failed to fetch score:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRescore = async () => {
    try {
      setIsRescoring(true);
      // Fetch resume first
      const resumeResponse = await fetch(
        `${API_URL}/api/resume/${user?.id}`
      );

      if (!resumeResponse.ok) {
        throw new Error('Resume not found');
      }

      const resume = await resumeResponse.json();

      // Score the resume
      const scoreResponse = await fetch(`${API_URL}/api/resume/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume),
      });

      if (scoreResponse.ok) {
        const newScore = await scoreResponse.json();
        setScoreData(newScore);
      }
    } catch (error) {
      console.error('Failed to rescore:', error);
      alert('Failed to rescore resume. Please try again.');
    } finally {
      setIsRescoring(false);
    }
  };

  const handleFixBullet = async (index: number) => {
    const bullet = scoreData?.bullet_feedback[index];
    if (!bullet) return;

    try {
      const response = await fetch(`${API_URL}/api/resume/polish-bullet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bullet: bullet.original,
          context: '',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Improved: ${data.improved}`);
      }
    } catch (error) {
      console.error('Failed to polish bullet:', error);
    }
  };

  const handleShareRoast = () => {
    // Generate share card with roast
    alert('Share functionality coming soon!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-neon-green font-mono text-xl mb-4">
            Loading score...█
          </div>
          <div className="text-gray-400 font-mono text-sm">
            Analyzing your resume
          </div>
        </div>
      </div>
    );
  }

  if (!scoreData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px', background: 'var(--bg)' }}>
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            padding: '48px',
            textAlign: 'center',
            maxWidth: '400px',
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>📊</div>
          <h2
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--green)',
              marginBottom: '12px',
            }}
          >
            No Score Yet
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px', fontFamily: 'JetBrains Mono' }}>
            Score your resume to see detailed feedback
          </p>
          <button
            onClick={() => navigate('/dashboard')}
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
            GO TO DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  // Convert bullet feedback to polish suggestions
  const polishSuggestions = scoreData.bullet_feedback
    .filter((b) => b.severity !== 'low')
    .map((b) => ({
      original: b.original,
      suggestion: b.suggestion,
      improvement: b.severity === 'high' ? 15 : 8,
    }));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', position: 'relative' }}>
      {/* Background grid */}
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

      {/* Top Nav */}
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
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: '11px',
            color: 'var(--muted)',
            letterSpacing: '0.1em',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
        >
          ← BACK TO DASHBOARD
        </button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        {/* Hero Score Section */}
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            padding: '48px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '48px',
            flexWrap: 'wrap',
          }}
        >
          {/* Left - Big Score Circle */}
          <div style={{ flex: '0 0 auto' }}>
            <ScoreDisplay
              overallScore={scoreData.overall_score}
              categories={scoreData.categories}
            />
          </div>

          {/* Right - Score Breakdown */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2
              style={{
                fontFamily: 'Space Grotesk',
                fontSize: '24px',
                fontWeight: 700,
                color: 'white',
                marginBottom: '8px',
              }}
            >
              {user?.email?.split('@')[0] || 'Your Resume'}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--muted)', marginBottom: '24px' }}>
              Professional Resume Analysis
            </p>

            {/* Category Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.entries(scoreData.categories).map(([key, cat]) => {
                const score = cat.score;
                const color =
                  score >= 76 ? 'var(--green)' : score >= 51 ? '#FFD700' : '#FF006E';
                return (
                  <div key={key}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '6px',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono',
                          fontSize: '11px',
                          color: 'var(--muted)',
                        }}
                      >
                        {cat.label}
                      </span>
                      <span
                        style={{
                          fontFamily: 'JetBrains Mono',
                          fontSize: '12px',
                          color: 'white',
                        }}
                      >
                        {score}
                      </span>
                    </div>
                    <div
                      style={{
                        height: '6px',
                        background: 'rgba(255,255,255,0.06)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${score}%`,
                          height: '100%',
                          background: color,
                          boxShadow: `0 0 10px ${color}`,
                          transition: 'width 1s ease-out',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Strengths List */}
            <div style={{ marginTop: '24px' }}>
              <div
                style={{
                  fontFamily: 'JetBrains Mono',
                  fontSize: '10px',
                  color: 'var(--green)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '12px',
                }}
              >
                STRENGTHS
              </div>
              {scoreData.strengths.slice(0, 3).map((strength, index) => (
                <div
                  key={index}
                  style={{
                    fontSize: '13px',
                    color: 'rgba(255,255,255,0.7)',
                    marginBottom: '6px',
                  }}
                >
                  ✓ {strength}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mode Tabs */}
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            padding: '4px',
            display: 'flex',
            gap: '4px',
            marginBottom: '24px',
          }}
        >
          {(['feedback', 'roast', 'polish'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '12px 24px',
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                background: activeTab === tab ? 'var(--bg3)' : 'transparent',
                border: activeTab === tab ? '1px solid var(--border)' : '1px solid transparent',
                borderRadius: '6px',
                color: activeTab === tab ? 'white' : 'var(--muted)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) {
                  e.currentTarget.style.color = 'var(--muted)';
                }
              }}
            >
              {tab === 'roast' ? 'ROAST 🔥' : tab === 'polish' ? 'POLISH ✨' : 'FEEDBACK'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            padding: '32px',
            minHeight: '400px',
          }}
        >
          {activeTab === 'feedback' && (
            <BulletFeedback
              feedback={scoreData.bullet_feedback}
              onFixBullet={handleFixBullet}
            />
          )}

          {activeTab === 'roast' && (
            <RoastMode roastText={scoreData.roast} onShare={handleShareRoast} />
          )}

          {activeTab === 'polish' && (
            <PolishMode
              suggestions={polishSuggestions}
              onApplyOne={(index) => console.log('Apply one:', index)}
              onApplyAll={() => console.log('Apply all')}
            />
          )}
        </div>

        {/* Bottom Action Bar */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '24px',
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => navigate('/card')}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '14px 24px',
              fontFamily: 'Space Grotesk',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--purple)',
              background: 'transparent',
              border: '1px solid rgba(124,58,237,0.5)',
              borderRadius: '4px',
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
            VIEW 3D CARD →
          </button>
          <button
            onClick={handleRescore}
            disabled={isRescoring}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '14px 24px',
              fontFamily: 'Space Grotesk',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--muted)',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '4px',
              cursor: isRescoring ? 'not-allowed' : 'pointer',
              opacity: isRescoring ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isRescoring) {
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--muted)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          >
            {isRescoring ? 'RESCORING...█' : 'RE-SCORE ↺'}
          </button>
          <button
            onClick={() => alert('Share functionality coming soon!')}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '14px 24px',
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
            SHARE SCORE ↗
          </button>
        </div>
      </div>
    </div>
  );
};
