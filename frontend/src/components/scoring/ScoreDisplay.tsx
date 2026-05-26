import { motion } from 'framer-motion';
import { CircularScore } from './CircularScore';

interface CategoryScore {
  score: number;
  label: string;
}

interface ScoreDisplayProps {
  overallScore: number;
  categories: {
    ats_compatibility: CategoryScore;
    impact_language: CategoryScore;
    skill_relevance: CategoryScore;
    completeness: CategoryScore;
  };
}

export const ScoreDisplay = ({ overallScore, categories }: ScoreDisplayProps) => {
  // Calculate letter grade
  const getLetterGrade = (score: number) => {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'A-';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'B-';
    if (score >= 65) return 'C+';
    if (score >= 60) return 'C';
    return 'C-';
  };

  const letterGrade = getLetterGrade(overallScore);

  // Get color for overall score
  const getColor = (score: number) => {
    if (score >= 76) return '#00FF94';
    if (score >= 51) return '#FFD700';
    return '#FF006E';
  };

  const color = getColor(overallScore);

  return (
    <div className="space-y-8">
      {/* Overall Score Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,148,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,148,0.03)_1px,transparent_1px)] bg-[size:20px_20px] animate-pulse" />

        <div className="relative bg-dark-navy/50 backdrop-blur-sm border border-neon-green/30 rounded-lg p-8 text-center">
          {/* Pulsing glow ring */}
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              boxShadow: `0 0 30px ${color}`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <div className="relative z-10">
            <div className="text-sm text-gray-400 font-mono mb-2">OVERALL SCORE</div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
              className="text-8xl font-bold font-mono mb-2"
              style={{ color }}
            >
              {overallScore}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-3xl font-bold font-mono"
              style={{ color }}
            >
              {letterGrade}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="text-gray-400 font-mono mt-4"
            >
              {overallScore >= 90 && '🔥 Outstanding! Your resume is fire!'}
              {overallScore >= 76 && overallScore < 90 && '✨ Great work! Just a few tweaks needed.'}
              {overallScore >= 51 && overallScore < 76 && '💪 Good foundation, room for improvement.'}
              {overallScore < 51 && '🚀 Let\'s level this up together!'}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Category Scores Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <CircularScore
          score={categories.ats_compatibility.score}
          label={categories.ats_compatibility.label}
          delay={0}
        />
        <CircularScore
          score={categories.impact_language.score}
          label={categories.impact_language.label}
          delay={0.2}
        />
        <CircularScore
          score={categories.skill_relevance.score}
          label={categories.skill_relevance.label}
          delay={0.4}
        />
        <CircularScore
          score={categories.completeness.score}
          label={categories.completeness.label}
          delay={0.6}
        />
      </div>
    </div>
  );
};
