import { useState } from 'react';
import { Input } from '../ui/Input';

interface Skill {
  name: string;
  category: string;
  level?: string;
}

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

export const SkillsForm = ({ data, onChange }: SkillsFormProps) => {
  const [skills, setSkills] = useState<Skill[]>(
    data.length > 0 ? data : [{ name: '', category: 'technical', level: 'intermediate' }]
  );

  const addSkill = () => {
    const updated = [...skills, { name: '', category: 'technical', level: 'intermediate' }];
    setSkills(updated);
    onChange(updated);
  };

  const removeSkill = (index: number) => {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
    onChange(updated);
  };

  const updateSkill = (index: number, field: keyof Skill, value: string) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    setSkills(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {skills.map((skill, index) => (
          <div
            key={index}
            style={{
              background: '#0A0A1A',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '8px',
              padding: '20px',
              display: 'flex',
              gap: '16px',
              alignItems: 'end',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: '1 1 200px', minWidth: '200px' }}>
              <Input
                label="Skill Name"
                placeholder="React, Python, Leadership..."
                value={skill.name}
                onChange={(e) => updateSkill(index, 'name', e.target.value)}
                required
              />
            </div>

            <div style={{ flex: '0 0 180px' }}>
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
                Category
              </label>
              <select
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
                  cursor: 'pointer',
                  WebkitTextFillColor: '#ffffff',
                }}
                value={skill.category}
                onChange={(e) => updateSkill(index, 'category', e.target.value)}
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
              >
                <option value="technical" style={{ background: '#0A0A1A', color: '#ffffff' }}>
                  Technical
                </option>
                <option value="soft" style={{ background: '#0A0A1A', color: '#ffffff' }}>
                  Soft Skills
                </option>
                <option value="language" style={{ background: '#0A0A1A', color: '#ffffff' }}>
                  Language
                </option>
                <option value="tool" style={{ background: '#0A0A1A', color: '#ffffff' }}>
                  Tools
                </option>
              </select>
            </div>

            <div style={{ flex: '0 0 150px' }}>
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
                Level
              </label>
              <select
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
                  cursor: 'pointer',
                  WebkitTextFillColor: '#ffffff',
                }}
                value={skill.level}
                onChange={(e) => updateSkill(index, 'level', e.target.value)}
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
              >
                <option value="beginner" style={{ background: '#0A0A1A', color: '#ffffff' }}>
                  Beginner
                </option>
                <option value="intermediate" style={{ background: '#0A0A1A', color: '#ffffff' }}>
                  Intermediate
                </option>
                <option value="expert" style={{ background: '#0A0A1A', color: '#ffffff' }}>
                  Expert
                </option>
              </select>
            </div>

            {skills.length > 1 && (
              <button
                onClick={() => removeSkill(index)}
                style={{
                  color: '#ff4444',
                  background: 'transparent',
                  border: 'none',
                  padding: '12px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ff6666';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#ff4444';
                }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addSkill}
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
          marginTop: '16px',
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
        + Add Skill
      </button>
    </div>
  );
};
