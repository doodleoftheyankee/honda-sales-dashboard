'use client';

import { useState, useEffect, useMemo } from 'react';

interface TimeLeft { days: number; hours: number; minutes: number; seconds: number; }

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const endOfMonth = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = endOfMonth.getTime() - now.getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endOfMonth]);

  const isUrgent = timeLeft.days <= 3;
  const isCritical = timeLeft.days <= 1;

  return (
    <div className={`dashboard-card p-4 ${isCritical ? 'border-[#ef4444] animate-pulse' : isUrgent ? 'border-[#f59e0b]' : ''}`}>
      <div className="text-center">
        <div className="text-xs text-[#888] uppercase tracking-wider mb-2">Time Left This Month</div>
        <div className="flex items-center justify-center gap-3">
          <TimeBlock value={timeLeft.days} label="DAYS" urgent={isUrgent} critical={isCritical} />
          <span className="text-2xl text-[#888]">:</span>
          <TimeBlock value={timeLeft.hours} label="HRS" urgent={isUrgent} critical={isCritical} />
          <span className="text-2xl text-[#888]">:</span>
          <TimeBlock value={timeLeft.minutes} label="MIN" urgent={isUrgent} critical={isCritical} />
          <span className="text-2xl text-[#888]">:</span>
          <TimeBlock value={timeLeft.seconds} label="SEC" urgent={isUrgent} critical={isCritical} />
        </div>
        {isCritical && <div className="mt-2 text-[#ef4444] text-sm font-bold animate-pulse">FINAL PUSH!</div>}
      </div>
    </div>
  );
}

function TimeBlock({ value, label, urgent, critical }: { value: number; label: string; urgent: boolean; critical: boolean }) {
  return (
    <div className="text-center">
      <div className={`text-3xl font-bold tabular-nums ${critical ? 'text-[#ef4444]' : urgent ? 'text-[#f59e0b]' : 'text-white'}`}>{String(value).padStart(2, '0')}</div>
      <div className="text-[10px] text-[#888] tracking-wider">{label}</div>
    </div>
  );
}
