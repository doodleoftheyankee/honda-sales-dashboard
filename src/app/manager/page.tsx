'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardWrapper from '@/components/DashboardWrapper';
import CountdownTimer from '@/components/CountdownTimer';
import HotStreakTracker from '@/components/HotStreakTracker';
import { fetchDashboardData, DashboardData } from '@/lib/sheets';
import { getSheetsConfig, getGoals } from '@/lib/storage';

export default function ManagerDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const dashboardData = await fetchDashboardData();
      const goals = getGoals();
      if (dashboardData) {
        dashboardData.dealership.totalGoal = goals.totalGoal;
        dashboardData.dealership.totalGrossGoal = goals.totalGrossGoal;
        dashboardData.dealership.totalProgress = dashboardData.dealership.totalUnits / goals.totalGoal;
        dashboardData.dealership.totalRemaining = Math.max(0, goals.totalGoal - dashboardData.dealership.totalUnits);
      }
      setData(dashboardData);
    } catch (error) { console.error('Error loading data:', error); } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    loadData();
    const config = getSheetsConfig();
    const interval = setInterval(loadData, config.refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading || !data) {
    return (<DashboardWrapper><div className="flex items-center justify-center min-h-[calc(100vh-200px)]"><div className="w-16 h-16 border-4 border-[#cc0000] border-t-transparent rounded-full animate-spin" /></div></DashboardWrapper>);
  }

  const sortedSalespeople = [...data.salespeople].sort((a, b) => b.totalUnits - a.totalUnits);

  return (
    <DashboardWrapper>
      <div className="max-w-[1920px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Manager Dashboard</h1>
          <CountdownTimer />
        </div>
        {data.recentSales.length > 0 && (<div className="mb-8"><HotStreakTracker recentSales={data.recentSales} /></div>)}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="dashboard-card p-6 text-center"><div className="text-[#888] text-sm uppercase tracking-wide mb-2">Units Sold</div><div className="text-5xl font-black text-[#cc0000]">{data.dealership.totalUnits}</div><div className="text-[#888] mt-2">of {data.dealership.totalGoal} goal</div></div>
          <div className="dashboard-card p-6 text-center"><div className="text-[#888] text-sm uppercase tracking-wide mb-2">Units Needed</div><div className="text-5xl font-black text-[#f59e0b]">{data.dealership.totalRemaining}</div><div className="text-[#888] mt-2">to hit goal</div></div>
          <div className="dashboard-card p-6 text-center"><div className="text-[#888] text-sm uppercase tracking-wide mb-2">Total Gross</div><div className="text-4xl font-black text-[#22c55e]">${data.dealership.totalProfit.toLocaleString()}</div><div className="text-[#888] mt-2">of ${data.dealership.totalGrossGoal.toLocaleString()}</div></div>
          <div className="dashboard-card p-6 text-center"><div className="text-[#888] text-sm uppercase tracking-wide mb-2">Avg Per Unit</div><div className="text-4xl font-black text-[#22c55e]">${Math.round(data.dealership.avgProfit).toLocaleString()}</div><div className="text-[#888] mt-2">front + back</div></div>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="dashboard-card overflow-hidden">
            <div className="p-4 border-b border-[#2a2a2a] bg-[#cc0000]/10"><h2 className="text-xl font-semibold">Team Performance</h2></div>
            <div className="overflow-x-auto">
              <table className="tv-table">
                <thead><tr><th>Salesperson</th><th className="text-center">Units</th><th className="text-right">Gross</th><th className="text-right">Avg</th><th className="text-center">Status</th></tr></thead>
                <tbody>
                  {sortedSalespeople.map((person) => (
                    <tr key={person.name}>
                      <td className="font-semibold">{person.nickname}</td>
                      <td className="text-center text-xl font-bold">{person.totalUnits}</td>
                      <td className="text-right text-[#22c55e]">${person.totalProfit.toLocaleString()}</td>
                      <td className="text-right text-[#888]">${person.avgProfit.toLocaleString()}</td>
                      <td className="text-center">{person.bonusEligible ? (<span className="px-3 py-1 bg-[#22c55e]/20 text-[#22c55e] rounded-full text-sm">Bonus</span>) : (<span className="text-[#888] text-sm">{person.totalUnits}/8</span>)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="space-y-6">
            <div className="dashboard-card p-6">
              <h3 className="text-lg font-semibold mb-4">Goal Progress</h3>
              <div className="space-y-6">
                <div><div className="flex justify-between mb-2"><span className="text-[#888]">Units</span><span className="font-bold">{Math.round(data.dealership.totalProgress * 100)}%</span></div><div className="progress-bar h-6 rounded-full"><div className="progress-fill h-full honda-gradient rounded-full" style={{ width: `${Math.min(100, data.dealership.totalProgress * 100)}%` }} /></div></div>
                <div><div className="flex justify-between mb-2"><span className="text-[#888]">Gross Profit</span><span className="font-bold">{Math.round((data.dealership.totalProfit / data.dealership.totalGrossGoal) * 100)}%</span></div><div className="progress-bar h-6 rounded-full"><div className="progress-fill h-full bg-[#22c55e] rounded-full" style={{ width: `${Math.min(100, (data.dealership.totalProfit / data.dealership.totalGrossGoal) * 100)}%` }} /></div></div>
              </div>
            </div>
            <div className="dashboard-card p-6">
              <h3 className="text-lg font-semibold mb-4">Pace Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-[#1a1a1a] rounded-lg text-center"><div className="text-3xl font-bold text-[#cc0000]">{data.pace.total.pacePerDay.toFixed(1)}</div><div className="text-[#888] text-sm">cars/day needed</div></div>
                <div className="p-4 bg-[#1a1a1a] rounded-lg text-center"><div className="text-3xl font-bold">{data.daysRemaining}</div><div className="text-[#888] text-sm">days remaining</div></div>
              </div>
              <div className={`mt-4 p-4 rounded-lg text-center ${data.pace.total.onTrack ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#ef4444]/20 text-[#ef4444]'}`}><span className="font-bold text-lg">{data.pace.total.onTrack ? 'ON TRACK' : 'BEHIND PACE'}</span></div>
            </div>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}
