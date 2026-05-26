import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

interface ShareCardProps {
  overallScore: number;
  categories: {
    ats_compatibility: { score: number; label: string };
    impact_language: { score: number; label: string };
    skill_relevance: { score: number; label: string };
    completeness: { score: number; label: string };
  };
  userName?: string;
}

export const ShareCard = ({ overallScore, categories, userName = 'Anonymous' }: ShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    setIsGenerating(true);
    setShowCard(true);

    // Wait for card to render
    await new Promise((resolve) => setTimeout(resolve, 100));

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#020208',
        scale: 2,
        width: 1200,
        height: 630,
      });

      const link = document.createElement('a');
      link.download = `chainresume-score-${overallScore}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Failed to generate share card:', error);
    } finally {
      setIsGenerating(false);
      setTimeout(() => setShowCard(false), 500);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/score/${userName}`;
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  const getColor = (score: number) => {
    if (score >= 76) return '#00FF94';
    if (score >= 51) return '#FFD700';
    return '#FF006E';
  };

  const color = getColor(overallScore);

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex gap-3">
        <Button
          variant="primary"
          onClick={handleDownload}
          disabled={isGenerating}
          className="flex-1"
        >
          {isGenerating ? 'Generating...█' : 'Download Card 📥'}
        </Button>
        <Button variant="outline" onClick={handleCopyLink} className="flex-1">
          Copy Link 🔗
        </Button>
      </div>

      {/* Hidden card for screenshot (1200x630px OG image size) */}
      <div
        className={`${showCard ? 'block' : 'hidden'} fixed -left-[9999px] -top-[9999px]`}
      >
        <div
          ref={cardRef}
          className="relative"
          style={{
            width: '1200px',
            height: '630px',
            background: 'linear-gradient(135deg, #020208 0%, #0A0A1A 100%)',
            padding: '60px',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          {/* Neon border glow */}
          <div
            className="absolute inset-0"
            style={{
              border: `4px solid ${color}`,
              boxShadow: `0 0 40px ${color}, inset 0 0 40px ${color}40`,
            }}
          />

          {/* Background grid */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0,255,148,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,148,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <div
                  className="text-4xl font-bold mb-2"
                  style={{ color: '#00FF94' }}
                >
                  ChainResume
                </div>
                <div className="text-xl text-gray-400">AI Resume Score</div>
              </div>
              <div className="text-right">
                <div className="text-gray-400 text-lg">{userName}</div>
              </div>
            </div>

            {/* Big score */}
            <div className="text-center">
              <div
                className="text-[180px] font-bold leading-none mb-4"
                style={{
                  color,
                  textShadow: `0 0 60px ${color}`,
                }}
              >
                {overallScore}
              </div>
              <div className="text-3xl text-gray-300">Overall Score</div>
            </div>

            {/* Category mini scores */}
            <div className="grid grid-cols-4 gap-6">
              {Object.entries(categories).map(([key, cat]) => (
                <div key={key} className="text-center">
                  <div
                    className="text-4xl font-bold mb-2"
                    style={{ color: getColor(cat.score) }}
                  >
                    {cat.score}
                  </div>
                  <div className="text-sm text-gray-400">{cat.label}</div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center">
              <div className="text-lg text-gray-400">
                Verified by AI • Secured on Blockchain
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview card (smaller version) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-navy/50 backdrop-blur-sm border border-neon-green/30 rounded-lg p-4"
      >
        <div className="text-sm text-gray-400 font-mono mb-2">PREVIEW</div>
        <div className="aspect-[1200/630] bg-gradient-to-br from-deep-black to-dark-navy rounded border border-neon-green/20 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl font-bold font-mono mb-2" style={{ color }}>
              {overallScore}
            </div>
            <div className="text-sm text-gray-400 font-mono">
              Share your score on social media
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
