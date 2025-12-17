'use client';

import { useState, useEffect } from 'react';
import DashboardWrapper from '@/components/DashboardWrapper';
import { getSpiffs, saveSpiffs } from '@/lib/storage';
import { SpiffCar } from '@/types';

export default function SpiffsPage() {
  const [spiffs, setSpiffs] = useState<SpiffCar[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newSpiff, setNewSpiff] = useState<Partial<SpiffCar>>({ stockNumber: '', vehicle: '', age: 0, spiffAmount: 0, msrp: 0, notes: '' });

  useEffect(() => { setSpiffs(getSpiffs()); }, []);

  const handleAddSpiff = () => {
    if (!newSpiff.stockNumber || !newSpiff.vehicle) return;
    const spiff: SpiffCar = { id: Date.now().toString(), stockNumber: newSpiff.stockNumber || '', vehicle: newSpiff.vehicle || '', age: newSpiff.age || 0, spiffAmount: newSpiff.spiffAmount || 0, msrp: newSpiff.msrp || 0, notes: newSpiff.notes };
    const updated = [...spiffs, spiff];
    setSpiffs(updated); saveSpiffs(updated);
    setNewSpiff({ stockNumber: '', vehicle: '', age: 0, spiffAmount: 0, msrp: 0, notes: '' }); setIsEditing(false);
  };

  const handleDeleteSpiff = (id: string) => { const updated = spiffs.filter((s) => s.id !== id); setSpiffs(updated); saveSpiffs(updated); };

  const sortedSpiffs = [...spiffs].sort((a, b) => b.age - a.age);

  return (
    <DashboardWrapper>
      <div className="max-w-[1920px] mx-auto px-6 py-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-3xl font-bold tracking-tight">Spiff Cars</h1><p className="text-[#888] mt-1">Aged inventory with bonus incentives</p></div>
          <button onClick={() => setIsEditing(!isEditing)} className={`px-6 py-3 rounded-lg font-semibold transition-all ${isEditing ? 'bg-[#888] text-white' : 'bg-[#cc0000] text-white hover:bg-[#aa0000]'}`}>{isEditing ? 'Done' : 'Edit Spiffs'}</button>
        </div>
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-[#cc0000]/20 to-[#22c55e]/20 border border-[#cc0000]/50">
          <div className="flex items-center gap-4"><div className="text-4xl">💰</div><div><h2 className="text-xl font-bold text-[#22c55e]">SPIFF BONUS PROGRAM</h2><p className="text-[#888]">Sell these aged units and earn EXTRA cash on top of your regular commission!</p></div></div>
        </div>
        {isEditing && (
          <div className="dashboard-card p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Add New Spiff Car</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div><label className="block text-sm text-[#888] mb-2">Stock Number</label><input type="text" value={newSpiff.stockNumber} onChange={(e) => setNewSpiff({ ...newSpiff, stockNumber: e.target.value })} placeholder="H25001" className="edit-input w-full" /></div>
              <div className="lg:col-span-2"><label className="block text-sm text-[#888] mb-2">Vehicle</label><input type="text" value={newSpiff.vehicle} onChange={(e) => setNewSpiff({ ...newSpiff, vehicle: e.target.value })} placeholder="2025 Honda Accord Sport" className="edit-input w-full" /></div>
              <div><label className="block text-sm text-[#888] mb-2">Age (Days)</label><input type="number" value={newSpiff.age} onChange={(e) => setNewSpiff({ ...newSpiff, age: parseInt(e.target.value) || 0 })} className="edit-input w-full" /></div>
              <div><label className="block text-sm text-[#888] mb-2">Spiff ($)</label><input type="number" value={newSpiff.spiffAmount} onChange={(e) => setNewSpiff({ ...newSpiff, spiffAmount: parseInt(e.target.value) || 0 })} className="edit-input w-full" /></div>
              <div><label className="block text-sm text-[#888] mb-2">MSRP ($)</label><input type="number" value={newSpiff.msrp} onChange={(e) => setNewSpiff({ ...newSpiff, msrp: parseInt(e.target.value) || 0 })} className="edit-input w-full" /></div>
              <div className="lg:col-span-2"><label className="block text-sm text-[#888] mb-2">Notes</label><input type="text" value={newSpiff.notes} onChange={(e) => setNewSpiff({ ...newSpiff, notes: e.target.value })} placeholder="Optional notes..." className="edit-input w-full" /></div>
            </div>
            <div className="mt-4 flex justify-end"><button onClick={handleAddSpiff} disabled={!newSpiff.stockNumber || !newSpiff.vehicle} className="px-6 py-2 bg-[#22c55e] text-white rounded-lg font-semibold hover:bg-[#16a34a] transition-colors disabled:opacity-50">Add Spiff Car</button></div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {sortedSpiffs.map((spiff, index) => (
            <div key={spiff.id} className="dashboard-card p-6 relative">
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-[#cc0000] flex items-center justify-center text-white font-bold text-lg shadow-lg">#{index + 1}</div>
              <div className={`absolute -top-3 -right-3 px-3 py-1 rounded-full ${spiff.age >= 120 ? 'bg-[#ef4444]' : spiff.age >= 90 ? 'bg-[#f59e0b]' : 'bg-[#eab308]'} text-white text-sm font-bold shadow-lg`}>{spiff.age} DAYS</div>
              <div className="text-2xl font-bold text-[#cc0000] mb-2 mt-4">#{spiff.stockNumber}</div>
              <div className="text-lg font-semibold mb-4 leading-tight">{spiff.vehicle}</div>
              <div className="bg-[#22c55e]/20 border border-[#22c55e] rounded-lg p-4 text-center mb-4"><div className="text-sm text-[#22c55e] font-medium">SPIFF BONUS</div><div className="text-4xl font-bold text-[#22c55e]">${spiff.spiffAmount}</div></div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-[#888]">MSRP</span><span className="font-semibold">${spiff.msrp.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-[#888]">Age</span><span className={`font-semibold ${spiff.age >= 120 ? 'text-[#ef4444]' : spiff.age >= 90 ? 'text-[#f59e0b]' : 'text-[#eab308]'}`}>{spiff.age} days</span></div>
                {spiff.notes && <div className="pt-2 border-t border-[#2a2a2a]"><p className="text-[#888] text-xs">{spiff.notes}</p></div>}
              </div>
              {isEditing && (<div className="mt-4 pt-4 border-t border-[#2a2a2a]"><button onClick={() => handleDeleteSpiff(spiff.id)} className="w-full py-2 bg-[#ef4444] text-white rounded-lg text-sm hover:bg-[#dc2626]">Delete</button></div>)}
            </div>
          ))}
        </div>
        {spiffs.length === 0 && (<div className="text-center py-20 text-[#888]"><div className="text-6xl mb-4">🚗</div><p className="text-xl">No spiff cars configured</p><p className="mt-2">Click Edit Spiffs to add aged inventory</p></div>)}
      </div>
    </DashboardWrapper>
  );
}
