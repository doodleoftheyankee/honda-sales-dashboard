'use client';

import { useState, useEffect } from 'react';
import DashboardWrapper from '@/components/DashboardWrapper';
import { getSheetsConfig, saveSheetsConfig, SheetsConfig } from '@/lib/storage';

export default function SettingsPage() {
  const [config, setConfig] = useState<SheetsConfig>({ webAppUrl: '', refreshInterval: 60 });
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => { setConfig(getSheetsConfig()); }, []);

  const handleSave = () => { saveSheetsConfig(config); setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const handleTest = async () => {
    if (!config.webAppUrl) { setTestResult({ success: false, message: 'Please enter a Web App URL first' }); return; }
    setTesting(true); setTestResult(null);
    try {
      const response = await fetch(`${config.webAppUrl}?page=api`);
      if (response.ok) {
        const data = await response.json();
        setTestResult(data.timestamp ? { success: true, message: 'Connection successful!' } : { success: false, message: 'Unexpected data format.' });
      } else { setTestResult({ success: false, message: `HTTP Error: ${response.status}` }); }
    } catch (error) { setTestResult({ success: false, message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}` }); }
    finally { setTesting(false); }
  };

  return (
    <DashboardWrapper>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>
        <div className="dashboard-card p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Google Sheets Connection</h2>
          <div className="space-y-6">
            <div><label className="block text-sm text-[#888] mb-2">Google Apps Script Web App URL</label><input type="url" value={config.webAppUrl} onChange={(e) => setConfig({ ...config, webAppUrl: e.target.value })} placeholder="https://script.google.com/macros/s/..." className="edit-input w-full" /><p className="text-xs text-[#888] mt-2">Deploy your Google Apps Script as a web app and paste the URL here</p></div>
            <div><label className="block text-sm text-[#888] mb-2">Refresh Interval (seconds)</label><input type="number" value={config.refreshInterval} onChange={(e) => setConfig({ ...config, refreshInterval: parseInt(e.target.value) || 60 })} min={10} max={300} className="edit-input w-32" /></div>
            <div className="flex gap-4">
              <button onClick={handleSave} className="px-6 py-3 bg-[#cc0000] text-white rounded-lg font-semibold hover:bg-[#aa0000] transition-colors">{saved ? '✓ Saved!' : 'Save Settings'}</button>
              <button onClick={handleTest} disabled={testing} className="px-6 py-3 bg-[#2a2a2a] text-white rounded-lg font-semibold hover:bg-[#3a3a3a] transition-colors disabled:opacity-50">{testing ? 'Testing...' : 'Test Connection'}</button>
            </div>
            {testResult && (<div className={`p-4 rounded-lg ${testResult.success ? 'bg-[#22c55e]/20 text-[#22c55e]' : 'bg-[#ef4444]/20 text-[#ef4444]'}`}>{testResult.message}</div>)}
          </div>
        </div>
        <div className="dashboard-card p-8">
          <h2 className="text-xl font-semibold mb-6">Setup Instructions</h2>
          <div className="space-y-4 text-[#888]">
            <div className="p-4 bg-[#1a1a1a] rounded-lg"><h3 className="text-white font-semibold mb-2">Step 1: Create Google Apps Script</h3><p>Open your Google Sheet → Extensions → Apps Script</p></div>
            <div className="p-4 bg-[#1a1a1a] rounded-lg"><h3 className="text-white font-semibold mb-2">Step 2: Add the API Code</h3><p>Copy the provided Apps Script code into your project</p></div>
            <div className="p-4 bg-[#1a1a1a] rounded-lg"><h3 className="text-white font-semibold mb-2">Step 3: Deploy as Web App</h3><p>Deploy → New deployment → Web app → Execute as: Me, Access: Anyone</p></div>
            <div className="p-4 bg-[#1a1a1a] rounded-lg"><h3 className="text-white font-semibold mb-2">Step 4: Copy URL</h3><p>Copy the web app URL and paste it above</p></div>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}
