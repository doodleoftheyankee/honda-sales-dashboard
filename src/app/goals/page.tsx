'use client';

import { useState, useEffect } from 'react';
import DashboardWrapper from '@/components/DashboardWrapper';
import { getGoals, saveGoals } from '@/lib/storage';
import { MonthlyGoals } from '@/types';

export default function GoalsPage() {
  const [goals, setGoals] = useState<MonthlyGoals | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { setGoals(getGoals()); }, []);

  const handleSave = () => { if (goals) { saveGoals(goals); setIsEditing(false); } };

  if (!goals) return null;

  const progress = goals.totalCurrent / goals.totalGoal;

  return (
    <DashboardWrapper>
      <div className="max-w-[1920px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Monthly Goals</h1>
            <p className="text-[#888] mt-1">{goals.month} {goals.year}</p>
          </div>
          <button onClick={() => isEditing ? handleSave() : setIsEditing(true)} className={`px-6 py-3 rounded-lg font-semibold transition-all ${isEditing ? 'bg-[#22c55e] text-white' : 'bg-[#cc0000] text-white hover:bg-[#aa0000]'}`}>
            {isEditing ? 'Save Changes' : 'Edit Goals'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="dashboard-card p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Unit Sales Goal</h2>
              <div className="text-6xl font-black text-[#cc0000]">{goals.totalGoal}</div>
              <p className="text-[#888] mt-2">New Hondas This Month</p>
            </div>
            <div className="relative pt-8">
              <div className="progress-bar h-8 rounded-full">
                <div className="progress-fill h-full honda-gradient rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, progress * 100)}%` }} />
              </div>
              <div className="flex justify-between mt-4 text-lg">
                <span className="text-[#888]">Current: <span className="text-white font-bold">{goals.totalCurrent}</span></span>
                <span className="text-[#888]">Remaining: <span className="text-[#cc0000] font-bold">{Math.max(0, goals.totalGoal - goals.totalCurrent)}</span></span>
              </div>
            </div>
            {isEditing && (
              <div className="mt-8 p-6 bg-[#1a1a1a] rounded-xl">
                <label className="block text-sm text-[#888] mb-2">Unit Goal</label>
                <input type="number" value={goals.totalGoal} onChange={(e) => setGoals({ ...goals, totalGoal: parseInt(e.target.value) || 0 })} className="edit-input w-full text-2xl text-center" />
              </div>
            )}
          </div>

          <div className="dashboard-card p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Gross Profit Goal</h2>
              <div className="text-5xl font-black text-[#22c55e]">${goals.totalGrossGoal.toLocaleString()}</div>
              <p className="text-[#888] mt-2">Total Front + Back Gross</p>
            </div>
            {isEditing && (
              <div className="mt-8 p-6 bg-[#1a1a1a] rounded-xl">
                <label className="block text-sm text-[#888] mb-2">Gross Goal ($)</label>
                <input type="number" value={goals.totalGrossGoal} onChange={(e) => setGoals({ ...goals, totalGrossGoal: parseInt(e.target.value) || 0 })} className="edit-input w-full text-2xl text-center" />
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 dashboard-card p-8">
          <h2 className="text-2xl font-bold mb-6">Bonus Structure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-[#1a1a1a] rounded-xl">
              <div className="text-lg text-[#888] mb-2">Minimum Units for Bonus</div>
              {isEditing ? (
                <input type="number" value={goals.minVehiclesForBonus} onChange={(e) => setGoals({ ...goals, minVehiclesForBonus: parseInt(e.target.value) || 0 })} className="edit-input w-full text-3xl text-center" />
              ) : (
                <div className="text-4xl font-bold text-[#cc0000]">{goals.minVehiclesForBonus} units</div>
              )}
            </div>
            <div className="p-6 bg-[#1a1a1a] rounded-xl">
              <div className="text-lg text-[#888] mb-2">Bonus Per Person</div>
              {isEditing ? (
                <input type="number" value={goals.bonusPerPerson} onChange={(e) => setGoals({ ...goals, bonusPerPerson: parseInt(e.target.value) || 0 })} className="edit-input w-full text-3xl text-center" />
              ) : (
                <div className="text-4xl font-bold text-[#22c55e]">${goals.bonusPerPerson}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}
