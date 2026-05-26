import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { PersonalInfoForm } from '../components/resume/PersonalInfoForm';
import { ExperienceForm } from '../components/resume/ExperienceForm';
import { SkillsForm } from '../components/resume/SkillsForm';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const STEPS = [
  { id: 1, name: 'Personal Info', component: PersonalInfoForm },
  { id: 2, name: 'Experience', component: ExperienceForm },
  { id: 3, name: 'Skills', component: SkillsForm },
];

export const ResumeBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [resumeData, setResumeData] = useState<any>({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    summary: '',
    education: [],
    experience: [],
    skills: [],
    projects: [],
    links: [],
  });

  const user = useStore((state) => state.user);
  const setResume = useStore((state) => state.setResume);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (user) {
        saveResume();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [resumeData, user]);

  const saveResume = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${API_URL}/api/resume/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...resumeData, user_id: user.id }),
      });

      if (response.ok) {
        console.log('Resume auto-saved');
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('Please sign in to save your resume');
      navigate('/auth');
      return;
    }

    try {
      console.log('Saving resume...', { ...resumeData, user_id: user.id });
      
      const response = await fetch(`${API_URL}/api/resume/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...resumeData, user_id: user.id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Save failed:', response.status, errorText);
        alert(`Failed to save resume: ${response.status} ${response.statusText}`);
        return;
      }

      const savedData = await response.json();
      console.log('Resume saved successfully:', savedData);
      setResume(resumeData);
      
      // Ask if user wants to score the resume
      const shouldScore = window.confirm('Resume saved! Would you like to get your AI score now?');
      if (shouldScore) {
        console.log('Scoring resume...');
        
        // Score the resume
        const scoreResponse = await fetch(`${API_URL}/api/resume/score`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...resumeData, user_id: user.id }),
        });
        
        if (scoreResponse.ok) {
          const scoreData = await scoreResponse.json();
          console.log('Score received:', scoreData);
          navigate('/score');
        } else {
          const errorText = await scoreResponse.text();
          console.error('Scoring failed:', scoreResponse.status, errorText);
          alert(`Failed to score resume: ${scoreResponse.status} ${scoreResponse.statusText}`);
          navigate('/dashboard');
        }
      } else {
        // Show option to view 3D card
        const viewCard = window.confirm('Want to see your resume as a 3D holographic card?');
        if (viewCard) {
          navigate('/card');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error('Failed to save resume:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
    }
  };

  const updateStepData = (field: string, data: any) => {
    setResumeData({ ...resumeData, [field]: data });
  };

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
          padding: '0 40px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          overflow: 'visible',
        }}
      >
        <div
          style={{
            fontFamily: 'JetBrains Mono',
            fontSize: '14px',
            color: 'var(--green)',
            fontWeight: 700,
            whiteSpace: 'nowrap',
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
            textTransform: 'uppercase',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.2s',
            whiteSpace: 'nowrap',
            paddingRight: '8px',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
        >
          ← BACK TO DASHBOARD
        </button>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
        {/* Progress bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
            marginBottom: '40px',
            padding: '0 40px',
          }}
        >
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                flex: index < STEPS.length - 1 ? 1 : 'none',
              }}
            >
              {/* Circle */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor:
                      step.id === currentStep
                        ? 'var(--green)'
                        : step.id < currentStep
                        ? 'var(--green)'
                        : 'rgba(255,255,255,0.1)',
                    background:
                      step.id === currentStep
                        ? 'var(--green)'
                        : step.id < currentStep
                        ? 'rgba(0,255,148,0.1)'
                        : 'transparent',
                    color:
                      step.id === currentStep
                        ? '#020208'
                        : step.id < currentStep
                        ? 'var(--green)'
                        : 'var(--muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '14px',
                    fontWeight: 700,
                    boxShadow: step.id === currentStep ? '0 0 20px rgba(0,255,148,0.5)' : 'none',
                  }}
                >
                  {step.id}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    top: '44px',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: step.id === currentStep ? 'var(--green)' : 'var(--muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {step.name === 'Personal Info' ? 'IDENTITY' : step.name === 'Experience' ? 'EXPERIENCE' : 'SKILLS'}
                </div>
              </div>
              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: '1px',
                    maxWidth: '120px',
                    background: step.id < currentStep ? 'var(--green)' : 'rgba(255,255,255,0.08)',
                    margin: '0 8px',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px',
            padding: '40px',
          }}
        >
          {/* Section Heading */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                width: '3px',
                height: '16px',
                background: 'var(--green)',
                borderRadius: '2px',
                boxShadow: '0 0 8px rgba(0,255,148,0.6)',
                flexShrink: 0,
              }}
            />
            <h2
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '11px',
                fontWeight: 500,
                color: 'var(--green)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              {currentStep === 1 ? 'IDENTITY' : currentStep === 2 ? 'EXPERIENCE' : 'SKILLS'}
            </h2>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <PersonalInfoForm
                  data={resumeData}
                  onChange={(data) => setResumeData({ ...resumeData, ...data })}
                />
              )}
              {currentStep === 2 && (
                <ExperienceForm
                  data={resumeData.experience}
                  onChange={(data) => updateStepData('experience', data)}
                />
              )}
              {currentStep === 3 && (
                <SkillsForm
                  data={resumeData.skills}
                  onChange={(data) => updateStepData('skills', data)}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '40px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                color: currentStep === 1 ? 'rgba(102, 102, 128, 0.5)' : '#666680',
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderRadius: '4px',
                cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
                opacity: currentStep === 1 ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (currentStep !== 1) {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentStep !== 1) {
                  e.currentTarget.style.color = '#666680';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                }
              }}
            >
              ← BACK
            </button>

            <button
              onClick={handleNext}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #00FF94 0%, #00CC77 100%)',
                color: '#020208',
                fontFamily: 'Space Grotesk',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 40px rgba(0,255,148,0.4)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {currentStep === STEPS.length ? (
                <>🤖 GET AI SCORE →</>
              ) : (
                'NEXT STEP →'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
