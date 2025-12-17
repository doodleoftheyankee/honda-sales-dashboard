'use client';

import { RecentSale } from '@/lib/sheets';

interface HotStreakTrackerProps {
  recentSales: RecentSale[];
  compact?: boolean;
}

export default function HotStreakTracker({ recentSales, compact = false }: HotStreakTrackerProps) {
  const last24Hours = recentSales.filter(sale => {
    const saleDate = new Date(sale.date);
    const now = new Date();
    const diffHours = (now.getTime() - saleDate.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24;
  });

  const salesBySalesperson: Record<string, number> = {};
  last24Hours.forEach(sale => {
    salesBySalesperson[sale.salesPerson] = (salesBySalesperson[sale.salesPerson] || 0) + 1;
  });

  const hotSalespeople = Object.entries(salesBySalesperson).filter(([, count]) => count >= 2).sort((a, b) => b[1] - a[1]);

  if (hotSalespeople.length === 0) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#cc0000]/20 to-transparent border border-[#cc0000]/30 rounded-xl">
        <div className="text-2xl">🔥</div>
        <div className="flex items-center gap-4 overflow-x-auto">
          {hotSalespeople.map(([name, count]) => (
            <div key={name} className="flex items-center gap-2 px-3 py-1 bg-[#cc0000]/20 rounded-full whitespace-nowrap">
              <span className="font-semibold text-[#cc0000]">{name}</span>
              <span className="text-white font-bold">{count} sales</span>
              <span className="text-xs">in 24h</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-3xl">🔥</div>
        <h3 className="text-lg font-semibold">Hot Streak Tracker</h3>
        <span className="text-xs text-[#888]">Last 24 Hours</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {hotSalespeople.map(([name, count]) => (
          <div key={name} className="p-4 bg-gradient-to-br from-[#cc0000]/20 to-[#cc0000]/5 rounded-xl border border-[#cc0000]/30">
            <div className="font-semibold text-lg">{name}</div>
            <div className="text-3xl font-black text-[#cc0000]">{count}</div>
            <div className="text-xs text-[#888]">sales in 24h</div>
          </div>
        ))}
      </div>
    </div>
  );
}
