import { useState } from 'react';
import { Input } from '../ui/Input';

interface Experience {
  company: string;
  position: string;
  location?: string;
  start_date: string;
  end_date?: string;
  description: string;
  achievements: string[];
}

interface ExperienceFormProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export const ExperienceForm = ({ data, onChange }: ExperienceFormProps) => {
  const [experiences, setExperiences] = useState<Experience[]>(
    data.length > 0 ? data : [{
      company: '',
      position: '',
      location: '',
      start_date: '',
      end_date: '',
      description: '',
      achievements: ['']
    }]
  );

  const addExperience = () => {
    const newExp: Experience = {
      company: '',
      position: '',
      location: '',
      start_date: '',
      end_date: '',
      description: '',
      achievements: ['']
    };
    const updated = [...experiences, newExp];
    setExperiences(updated);
    onChange(updated);
  };

  const removeExperience = (index: number) => {
    const updated = experiences.filter((_, i) => i !== index);
    setExperiences(updated);
    onChange(updated);
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    setExperiences(updated);
    onChange(updated);
  };

  const addAchievement = (expIndex: number) => {
    const updated = [...experiences];
    updated[expIndex].achievements.push('');
    setExperiences(updated);
    onChange(updated);
  };

  const updateAchievement = (expIndex: number, achIndex: number, value: string) => {
    const updated = [...experiences];
    updated[expIndex].achievements[achIndex] = value;
    setExperiences(updated);
    onChange(updated);
  };

  const removeAchievement = (expIndex: number, achIndex: number) => {
    const updated = [...experiences];
    updated[expIndex].achievements = updated[expIndex].achievements.filter((_, i) => i !== achIndex);
    setExperiences(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {experiences.map((exp, expIndex) => (
        <div
          key={expIndex}
          style={{
            background: '#0A0A1A',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '8px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3
              style={{
                fontFamily: 'JetBrains Mono',
                fontSize: '12px',
                color: '#00D4FF',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              Experience #{expIndex + 1}
            </h3>
            {experiences.length > 1 && (
              <button
                onClick={() => removeExperience(expIndex)}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 0, 0, 0.3)',
                  color: '#ff4444',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '11px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 0, 0, 0.1)';
                  e.currentTarget.style.borderColor = '#ff4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(255, 0, 0, 0.3)';
                }}
              >
                REMOVE
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Input
              label="Company"
              placeholder="Tech Corp"
              value={exp.company}
              onChange={(e) => updateExperience(expIndex, 'company', e.target.value)}
              required
            />

            <Input
              label="Position"
              placeholder="Senior Developer"
              value={exp.position}
              onChange={(e) => updateExperience(expIndex, 'position', e.target.value)}
              required
            />

            <Input
              label="Location"
              placeholder="Remote / San Francisco, CA"
              value={exp.location || ''}
              onChange={(e) => updateExperience(expIndex, 'location', e.target.value)}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <Input
                label="Start Date"
                type="month"
                value={exp.start_date}
                onChange={(e) => updateExperience(expIndex, 'start_date', e.target.value)}
                required
              />
              <Input
                label="End Date (leave empty if current)"
                type="month"
                value={exp.end_date || ''}
                onChange={(e) => updateExperience(expIndex, 'end_date', e.target.value)}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  fontWeight: 500,
                  color: '#666680',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                Description
              </label>
              <textarea
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  minHeight: '80px',
                  resize: 'vertical',
                  WebkitTextFillColor: '#ffffff',
                }}
                placeholder="Brief description of your role..."
                value={exp.description}
                onChange={(e) => updateExperience(expIndex, 'description', e.target.value)}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#00FF94';
                  e.currentTarget.style.background = 'rgba(0, 255, 148, 0.04)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 255, 148, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  fontWeight: 500,
                  color: '#666680',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                Key Achievements
              </label>
              {exp.achievements.map((achievement, achIndex) => (
                <div key={achIndex} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <Input
                    placeholder="• Led team of 5 engineers to deliver..."
                    value={achievement}
                    onChange={(e) => updateAchievement(expIndex, achIndex, e.target.value)}
                  />
                  {exp.achievements.length > 1 && (
                    <button
                      onClick={() => removeAchievement(expIndex, achIndex)}
                      style={{
                        color: '#ff4444',
                        background: 'transparent',
                        border: 'none',
                        padding: '0 12px',
                        cursor: 'pointer',
                        fontSize: '18px',
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addAchievement(expIndex)}
                style={{
                  marginTop: '8px',
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#666680',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = '#666680';
                }}
              >
                + Add Achievement
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        style={{
          width: '100%',
          padding: '14px',
          background: 'rgba(0, 255, 148, 0.08)',
          border: '1px solid rgba(0, 255, 148, 0.2)',
          color: '#00FF94',
          fontFamily: 'Space Grotesk',
          fontWeight: 600,
          fontSize: '14px',
          letterSpacing: '0.05em',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0, 255, 148, 0.12)';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 148, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0, 255, 148, 0.08)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        + Add Another Experience
      </button>
    </div>
  );
};
