import { Input } from '../ui/Input';

interface PersonalInfoFormProps {
  data: any;
  onChange: (data: any) => void;
}

export const PersonalInfoForm = ({ data, onChange }: PersonalInfoFormProps) => {
  const handleChange = (field: string, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 2-column grid for name and email */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
        }}
        className="responsive-grid"
      >
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={data.full_name || ''}
          onChange={(e) => handleChange('full_name', e.target.value)}
          required
        />
        
        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          value={data.email || ''}
          onChange={(e) => handleChange('email', e.target.value)}
          required
        />
      </div>

      {/* 2-column grid for phone and location */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
        }}
        className="responsive-grid"
      >
        <Input
          label="Phone"
          type="tel"
          placeholder="+1 (555) 123-4567"
          value={data.phone || ''}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
        
        <Input
          label="Location"
          placeholder="San Francisco, CA"
          value={data.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
        />
      </div>
      
      {/* Full width title */}
      <Input
        label="Professional Title"
        placeholder="Senior Software Engineer"
        value={data.title || ''}
        onChange={(e) => handleChange('title', e.target.value)}
        required
      />
      
      {/* Full width summary */}
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
          Professional Summary
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
            minHeight: '120px',
            resize: 'vertical',
            WebkitTextFillColor: '#ffffff',
          }}
          placeholder="Brief summary of your professional background..."
          value={data.summary || ''}
          onChange={(e) => handleChange('summary', e.target.value)}
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

      <style>{`
        @media (max-width: 768px) {
          .responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
