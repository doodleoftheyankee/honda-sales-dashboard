'use client';

import { RecentSale } from '@/lib/sheets';

interface DealTickerProps {
  deals: RecentSale[];
}

export default function DealTicker({ deals }: DealTickerProps) {
  if (!deals || deals.length === 0) return null;

  return (
    <div className="fixed bottom-10 left-0 right-0 bg-gradient-to-r from-[#0a0a0a] via-[#141414] to-[#0a0a0a] border-t border-b border-[#2a2a2a] py-2 z-40 overflow-hidden">
      <div className="flex items-center">
        <div className="flex-shrink-0 bg-[#cc0000] px-4 py-1 mr-4">
          <span className="text-white font-bold text-sm uppercase tracking-wider">Recent Deals</span>
        </div>
        <div className="overflow-hidden flex-1">
          <div className="ticker-scroll flex items-center gap-8 whitespace-nowrap">
            {[...deals, ...deals].map((deal, index) => (
              <div key={`${deal.stockNumber}-${index}`} className="flex items-center gap-3 px-4 py-1 bg-[#1a1a1a] rounded-full border border-[#2a2a2a]">
                <div className="w-2 h-2 rounded-full bg-[#cc0000]" />
                <span className="text-white font-medium">{deal.year} {deal.make} {deal.model}</span>
                <span className="text-[#888]">|</span>
                <span className="text-[#cc0000]">{deal.salesPerson}</span>
                <span className="text-[#888]">|</span>
                <span className="font-bold text-[#22c55e]">${deal.totalProfit.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        .ticker-scroll { animation: ticker 30s linear infinite; }
        .ticker-scroll:hover { animation-play-state: paused; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}
