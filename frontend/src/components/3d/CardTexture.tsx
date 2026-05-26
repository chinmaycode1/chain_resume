import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';

export interface CardTextureProps {
  name: string;
  title: string;
  skills: string[];
  aiScore: number;
  walletAddress?: string;
  isVerified: boolean;
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const useCardTexture = (props: CardTextureProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  // Create canvas once
  if (!canvasRef.current) {
    canvasRef.current = document.createElement('canvas');
    canvasRef.current.width = 1024;
    canvasRef.current.height = 640;
  }

  const drawCard = useMemo(() => {
    return () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { name, title, skills, aiScore, isVerified, themeColors } = props;

      // Clear canvas
      ctx.clearRect(0, 0, 1024, 640);

      // Background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, 640);
      bgGradient.addColorStop(0, '#020208');
      bgGradient.addColorStop(1, '#0A0A1A');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, 1024, 640);

      // Grid lines
      ctx.strokeStyle = 'rgba(0, 255, 148, 0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < 1024; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 640);
        ctx.stroke();
      }
      for (let y = 0; y < 640; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
      }

      // Top left: CHAINRESUME
      ctx.font = 'bold 13px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#00FF94';
      ctx.fillText('CHAINRESUME', 40, 40);

      // Top right: Verification status
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      if (isVerified) {
        ctx.fillStyle = '#00FF94';
        ctx.fillText('⛓ POLYGON ✓ VERIFIED', 1024 - 220, 40);
      } else {
        ctx.fillStyle = '#666';
        ctx.fillText('⛓ POLYGON UNVERIFIED', 1024 - 220, 40);
      }

      // Center: User name
      ctx.font = 'bold 38px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(name.toUpperCase(), 512, 200);

      // Below name: Title
      ctx.font = '18px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#00D4FF';
      ctx.fillText(title, 512, 235);

      // Divider line
      const dividerGradient = ctx.createLinearGradient(200, 260, 824, 260);
      dividerGradient.addColorStop(0, 'rgba(0, 255, 148, 0)');
      dividerGradient.addColorStop(0.5, 'rgba(0, 255, 148, 0.8)');
      dividerGradient.addColorStop(1, 'rgba(0, 255, 148, 0)');
      ctx.strokeStyle = dividerGradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(200, 260);
      ctx.lineTo(824, 260);
      ctx.stroke();

      // TOP SKILLS label
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#7C3AED';
      ctx.textAlign = 'left';
      ctx.fillText('TOP SKILLS', 40, 300);

      // Skill pills (max 6)
      const displaySkills = skills.slice(0, 6);
      let skillX = 40;
      let skillY = 320;
      ctx.font = '14px "JetBrains Mono", monospace';

      displaySkills.forEach((skill, index) => {
        const skillWidth = ctx.measureText(skill).width + 24;
        
        // Move to next row if needed
        if (skillX + skillWidth > 984 && index > 0) {
          skillX = 40;
          skillY += 35;
        }

        // Skill pill background
        ctx.fillStyle = 'rgba(0, 255, 148, 0.1)';
        ctx.strokeStyle = themeColors.primary;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(skillX, skillY, skillWidth, 28, 14);
        ctx.fill();
        ctx.stroke();

        // Skill text
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(skill, skillX + 12, skillY + 19);

        skillX += skillWidth + 12;
      });

      // Bottom left: AI Score badge
      const scoreColor = aiScore >= 76 ? '#00FF94' : aiScore >= 51 ? '#FFD700' : '#FF006E';
      
      // Score glow
      ctx.shadowColor = scoreColor;
      ctx.shadowBlur = 20;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.beginPath();
      ctx.roundRect(40, 540, 180, 60, 8);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Score border
      ctx.strokeStyle = scoreColor;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Score text
      ctx.font = 'bold 24px "JetBrains Mono", monospace';
      ctx.fillStyle = scoreColor;
      ctx.textAlign = 'left';
      ctx.fillText(`AI SCORE: ${aiScore}`, 55, 570);
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#999';
      ctx.fillText('/100', 190, 570);

      // Bottom right: QR placeholder
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(1024 - 100, 540, 60, 60);
      
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = '#666';
      ctx.textAlign = 'center';
      ctx.fillText('SCAN TO', 1024 - 70, 615);
      ctx.fillText('VERIFY', 1024 - 70, 628);

      // Outer border
      ctx.strokeStyle = themeColors.primary;
      ctx.lineWidth = 3;
      ctx.shadowColor = themeColors.primary;
      ctx.shadowBlur = 15;
      ctx.strokeRect(10, 10, 1004, 620);
      ctx.shadowBlur = 0;

      // Create or update texture
      if (!textureRef.current) {
        textureRef.current = new THREE.CanvasTexture(canvas);
      } else {
        textureRef.current.needsUpdate = true;
      }
    };
  }, [props]);

  useEffect(() => {
    drawCard();
  }, [drawCard]);

  return textureRef.current;
};
