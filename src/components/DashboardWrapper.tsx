'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Navigation from './Navigation';
import DealTicker from './DealTicker';
import { fetchDashboardData, RecentSale } from '@/lib/sheets';

interface DashboardWrapperProps {
  children: React.ReactNode;
}

export default function DashboardWrapper({ children }: DashboardWrapperProps) {
  const [recentDeals, setRecentDeals] = useState<RecentSale[]>([]);
  const [autoRotate, setAutoRotate] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const pages = ['/', '/goals', '/spiffs'];

  useEffect(() => {
    const loadDeals = async () => {
      try {
        const data = await fetchDashboardData();
        setRecentDeals(data.recentSales || []);
      } catch (error) {
        console.error('Error loading deals:', error);
      }
    };
    loadDeals();
    const interval = setInterval(loadDeals, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!autoRotate) return;
    const currentIndex = pages.indexOf(pathname);
    const nextIndex = (currentIndex + 1) % pages.length;
    const timer = setTimeout(() => {
      router.push(pages[nextIndex]);
    }, 15000);
    return () => clearTimeout(timer);
  }, [autoRotate, pathname, router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      <main className="pb-24">{children}</main>
      <DealTicker deals={recentDeals} />
      <div className="fixed bottom-2 right-4 z-50">
        <button onClick={() => setAutoRotate(!autoRotate)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${autoRotate ? 'bg-[#cc0000] text-white' : 'bg-[#2a2a2a] text-[#888] hover:text-white'}`}>
          {autoRotate ? '⏸ Auto-Rotate ON' : '▶ Auto-Rotate'}
        </button>
      </div>
    </div>
  );
}
