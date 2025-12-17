'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardWrapper from '@/components/DashboardWrapper';
import HotStreakTracker from '@/components/HotStreakTracker';
import IndividualGoals from '@/components/IndividualGoals';
import { fetchDashboardData, DashboardData, SalespersonMetrics } from '@/lib/sheets';
import { getSheetsConfig, getGoals } from '@/lib/storage';

export default function SalesLeaderboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const loadData = useCallback(async () => {
    try {
      const dashboardData = await fetchDashboardData();
      const goals = getGoals();
      if (dashboardData) {
        dashboardData.dealership.totalGoal = goals.totalGoal;
        dashboardData.dealership.totalGrossGoal = goals.totalGrossGoal;
        dashboardData.dealership.totalProgress = dashboardData.dealership.totalUnits / goals.totalGoal;
        dashboardData.dealership.totalRemaining = Math.max(0, goals.totalGoal - dashboardData.dealership.totalUnits);
        const daysRemaining = dashboardData.daysRemaining || 1;
        dashboardData.pace.total.goal = goals.totalGoal;
        dashboardData.pace.total.needed = dashboardData.dealership.totalRemaining;
        dashboardData.pace.total.pacePerDay = dashboardData.dealership.totalRemaining / daysRemaining;
        dashboardData.pace.total.onTrack = dashboardData.dealership.totalProgress >= dashboardData.percentComplete;
      }
      setData(dashboardData);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const config = getSheetsConfig();
    const interval = setInterval(loadData, config.refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading) {
    return (
      <DashboardWrapper>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#cc0000] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#888]">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardWrapper>
    );
  }

  if (!data) {
    return (
      <DashboardWrapper>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center text-[#888]">
            <p>Unable to load dashboard data.</p>
            <button onClick={loadData} className="mt-4 px-6 py-2 bg-[#cc0000] text-white rounded-lg">Retry</button>
          </div>
        </div>
      </DashboardWrapper>
    );
  }

  const sortedSalespeople = [...data.salespeople].sort((a, b) => b.totalUnits - a.totalUnits);

  return (
    <DashboardWrapper>
      <div className="max-w-[1920px] mx-auto px-6 py-8 pb-20">
        {data.errorMessage && (
          <div className="mb-6 p-4 bg-[#f59e0b]/20 border border-[#f59e0b] rounded-lg text-[#f59e0b] text-center">{data.errorMessage}</div>
        )}
        {data.recentSales.length > 0 && (
          <div className="mb-6"><HotStreakTracker recentSales={data.recentSales} compact /></div>
        )}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sales Leaderboard</h1>
            <p className="text-[#888] mt-1">{data.monthName} | Day {data.daysElapsed} of {data.daysInMonth} ({data.daysRemaining} remaining)</p>
          </div>
          <div className="text-right text-sm text-[#888]">
            <p>Last updated: {lastUpdate}</p>
            <button onClick={loadData} className="text-[#cc0000] hover:underline">Refresh</button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="dashboard-card p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#888] uppercase tracking-wide">Units Sold</span>
              <span className="text-[#cc0000] text-3xl font-bold">{data.dealership.totalUnits}/{data.dealership.totalGoal}</span>
            </div>
            <div className="progress-bar h-4">
              <div className="progress-fill h-full honda-gradient rounded-full" style={{ width: `${Math.min(100, data.dealership.totalProgress * 100)}%` }} />
            </div>
            <p className="text-sm text-[#888] mt-2">Need <span className="text-white font-bold">{data.dealership.totalRemaining}</span> more to hit goal</p>
          </div>
          <div className="dashboard-card p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#888] uppercase tracking-wide">Total Gross</span>
              <span className="text-[#22c55e] text-3xl font-bold">${data.dealership.totalProfit.toLocaleString()}</span>
            </div>
            <div className="progress-bar h-4">
              <div className="progress-fill h-full bg-[#22c55e] rounded-full" style={{ width: `${Math.min(100, (data.dealership.totalProfit / data.dealership.totalGrossGoal) * 100)}%` }} />
            </div>
            <p className="text-sm text-[#888] mt-2">Goal: ${data.dealership.totalGrossGoal.toLocaleString()}</p>
          </div>
          <div className="dashboard-card p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[#888] uppercase tracking-wide">Avg Profit/Unit</span>
              <span className="text-[#22c55e] text-3xl font-bold">${Math.round(data.dealership.avgProfit).toLocaleString()}</span>
            </div>
            <div className="text-center mt-4">
              <span className="text-[#888]">Bonus Eligible: </span>
              <span className="text-xl font-bold text-[#22c55e]">{data.dealership.bonusEligibleCount}/{data.dealership.teamSize}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 dashboard-card overflow-hidden">
            <div className="p-4 border-b border-[#2a2a2a]"><h2 className="text-xl font-semibold">Team Leaderboard</h2></div>
            <div className="overflow-x-auto">
              <table className="tv-table">
                <thead><tr><th className="w-16">Rank</th><th>Salesperson</th><th className="text-center">Units</th><th className="text-right">Profit</th><th className="text-right">Avg/Unit</th><th className="text-center">Bonus</th></tr></thead>
                <tbody>{sortedSalespeople.map((person, index) => (<SalespersonRow key={person.name} person={person} rank={index + 1} />))}</tbody>
              </table>
            </div>
          </div>
          <div className="space-y-6">
            <div className="dashboard-card p-6">
              <h3 className="text-lg font-semibold mb-4">Pace to Goal</h3>
              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#cc0000] font-semibold text-lg">Monthly Goal</span>
                  <span className={`text-sm px-3 py-1 rounded-full ${data.pace.total.onTrack ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#ef4444]/20 text-[#ef4444]'}`}>{data.pace.total.onTrack ? 'On Track' : 'Behind Pace'}</span>
                </div>
                <div className="text-3xl font-bold mb-1">{data.pace.total.needed} <span className="text-lg text-[#888] font-normal">cars to go</span></div>
                <div className="text-[#888]">Need <span className="text-white font-semibold">{data.pace.total.pacePerDay.toFixed(1)}</span> per day</div>
              </div>
            </div>
            <IndividualGoals salespeople={data.salespeople} editable />
            <div className="dashboard-card p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Sales</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {data.recentSales.slice(0, 5).map((sale, index) => (
                  <div key={index} className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{sale.year} {sale.make} {sale.model}</span>
                      <span className="text-[#22c55e] font-semibold">${sale.totalProfit.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs text-[#888]">
                      <span>{sale.salesPerson}</span><span>#{sale.stockNumber}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}

function SalespersonRow({ person, rank }: { person: SalespersonMetrics; rank: number }) {
  const getRankClass = () => { if (rank === 1) return 'rank-1'; if (rank === 2) return 'rank-2'; if (rank === 3) return 'rank-3'; return 'bg-[#2a2a2a] text-white'; };
  return (
    <tr className="animate-fade-in" style={{ animationDelay: `${rank * 50}ms` }}>
      <td><div className={`rank-badge ${getRankClass()}`}>{rank}</div></td>
      <td><div className="font-semibold">{person.nickname}</div></td>
      <td className="text-center"><span className="text-2xl font-bold">{person.totalUnits}</span></td>
      <td className="text-right"><span className="text-[#22c55e] font-semibold">${person.totalProfit.toLocaleString()}</span></td>
      <td className="text-right"><span className="text-[#888]">${person.avgProfit.toLocaleString()}</span></td>
      <td className="text-center">{person.bonusEligible ? (<span className="inline-flex items-center px-3 py-1 rounded-full bg-[#22c55e]/20 text-[#22c55e] text-sm font-medium">${person.bonusAmount}</span>) : (<span className="text-[#888] text-sm">{person.totalUnits}/8</span>)}</td>
    </tr>
  );
}
