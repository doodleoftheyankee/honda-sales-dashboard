'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';

interface CelebrationProps {
  trigger: boolean;
  message?: string;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  velocityX: number;
  velocityY: number;
  delay: number;
}

export default function Celebration({ trigger, message = "GOAL HIT!", onComplete }: CelebrationProps) {
  const [isActive, setIsActive] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const createParticles = useCallback(() => {
    const colors = ['#cc0000', '#22c55e', '#f59e0b', '#ffffff', '#ff6666'];
    const newParticles: Particle[] = [];
    for (let i = 0; i < 150; i++) {
      newParticles.push({
        id: i, x: Math.random() * 100, y: -10, color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 10 + 5, rotation: Math.random() * 360, velocityX: (Math.random() - 0.5) * 3,
        velocityY: Math.random() * 3 + 2, delay: Math.random() * 0.5,
      });
    }
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      createParticles();
      const timer = setTimeout(() => { setIsActive(false); setParticles([]); onComplete?.(); }, 5000);
      return () => clearTimeout(timer);
    }
  }, [trigger, isActive, createParticles, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-[#cc0000] animate-pulse opacity-20" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl md:text-8xl font-black text-white drop-shadow-lg">{message}</div>
          <div className="text-2xl md:text-4xl text-[#22c55e] font-bold mt-4">KEEP PUSHING!</div>
        </div>
      </div>
      {particles.map((particle) => (
        <div key={particle.id} className="absolute animate-bounce" style={{ left: `${particle.x}%`, top: `${particle.y}%`, width: particle.size, height: particle.size, backgroundColor: particle.color, transform: `rotate(${particle.rotation}deg)`, animationDelay: `${particle.delay}s` }} />
      ))}
    </div>
  );
}

export function useGoalCelebration(goals: { totalHit: boolean }) {
  const [previousGoals, setPreviousGoals] = useState({ totalHit: false });
  const [celebration, setCelebration] = useState<{ active: boolean; message: string }>({ active: false, message: '' });

  useEffect(() => {
    if (goals.totalHit && !previousGoals.totalHit) {
      setCelebration({ active: true, message: 'MONTHLY GOAL HIT!' });
    }
    setPreviousGoals(goals);
  }, [goals, previousGoals]);

  const clearCelebration = useCallback(() => { setCelebration({ active: false, message: '' }); }, []);
  return { celebration, clearCelebration };
}
