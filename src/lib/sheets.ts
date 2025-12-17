import { getSheetsConfig } from './storage';

export interface DashboardData {
  timestamp: string;
  monthName: string;
  daysElapsed: number;
  daysRemaining: number;
  daysInMonth: number;
  percentComplete: number;
  errorMessage?: string;
  goals: { totalGoal: number; totalGrossGoal: number; };
  dealership: {
    totalUnits: number;
    totalGoal: number;
    totalProgress: number;
    totalRemaining: number;
    totalProfit: number;
    avgProfit: number;
    totalGrossGoal: number;
    bonusEligibleCount: number;
    teamSize: number;
  };
  salespeople: SalespersonMetrics[];
  recentSales: RecentSale[];
  pace: { total: PaceData; };
}

export interface SalespersonMetrics {
  name: string;
  nickname: string;
  totalUnits: number;
  totalProfit: number;
  avgProfit: number;
  bonusEligible: boolean;
  bonusAmount: number;
}

export interface RecentSale {
  date: string;
  dealNumber: string;
  stockNumber: string;
  make: string;
  model: string;
  year: number;
  customerName: string;
  salesPerson: string;
  totalProfit: number;
}

export interface PaceData { sold: number; goal: number; needed: number; pacePerDay: number; onTrack: boolean; }

export async function fetchDashboardData(): Promise<DashboardData> {
  const config = getSheetsConfig();
  if (config.webAppUrl) {
    try {
      const response = await fetch(`${config.webAppUrl}?page=api`, { method: 'GET', headers: { 'Accept': 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json() as DashboardData;
    } catch (error) {
      console.error('Error fetching from web app:', error);
      return getMockDashboardData('Connection error: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
  return getMockDashboardData('Google Sheets not configured. Go to Settings to connect.');
}

function getMockDashboardData(errorMessage?: string): DashboardData {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysElapsed = now.getDate();
  const totalUnits = 42;
  const totalGoal = 70;

  return {
    timestamp: now.toISOString(),
    monthName: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    daysElapsed,
    daysRemaining: daysInMonth - daysElapsed,
    daysInMonth,
    percentComplete: daysElapsed / daysInMonth,
    errorMessage,
    goals: { totalGoal: 70, totalGrossGoal: 150000 },
    dealership: {
      totalUnits,
      totalGoal,
      totalProgress: totalUnits / totalGoal,
      totalRemaining: totalGoal - totalUnits,
      totalProfit: 92400,
      avgProfit: 2200,
      totalGrossGoal: 150000,
      bonusEligibleCount: 3,
      teamSize: 6,
    },
    salespeople: [
      { name: 'MIKE MC', nickname: 'Mike MC', totalUnits: 12, totalProfit: 26400, avgProfit: 2200, bonusEligible: true, bonusAmount: 500 },
      { name: 'DONALD S', nickname: 'Donald S', totalUnits: 10, totalProfit: 22000, avgProfit: 2200, bonusEligible: true, bonusAmount: 500 },
      { name: 'TERRANCE G', nickname: 'Terrance G', totalUnits: 8, totalProfit: 17600, avgProfit: 2200, bonusEligible: true, bonusAmount: 500 },
      { name: 'ANTHONY E', nickname: 'Anthony E', totalUnits: 6, totalProfit: 13200, avgProfit: 2200, bonusEligible: false, bonusAmount: 0 },
      { name: 'JESUS C', nickname: 'Jesus C', totalUnits: 4, totalProfit: 8800, avgProfit: 2200, bonusEligible: false, bonusAmount: 0 },
      { name: 'RILEY B', nickname: 'Riley B', totalUnits: 2, totalProfit: 4400, avgProfit: 2200, bonusEligible: false, bonusAmount: 0 },
    ],
    recentSales: [
      { date: '2024-12-16', dealNumber: '157021', stockNumber: 'H25042', make: 'Honda', model: 'Accord Sport', year: 2025, customerName: 'JOHNSON, MICHAEL', salesPerson: 'Mike MC', totalProfit: 2400 },
      { date: '2024-12-15', dealNumber: '157020', stockNumber: 'H25018', make: 'Honda', model: 'CR-V Touring', year: 2025, customerName: 'SMITH, SARAH', salesPerson: 'Donald S', totalProfit: 2800 },
      { date: '2024-12-15', dealNumber: '157019', stockNumber: 'H25033', make: 'Honda', model: 'Pilot TrailSport', year: 2025, customerName: 'DAVIS, ROBERT', salesPerson: 'Terrance G', totalProfit: 3100 },
      { date: '2024-12-14', dealNumber: '157018', stockNumber: 'H25041', make: 'Honda', model: 'Civic Si', year: 2025, customerName: 'WILSON, JAMES', salesPerson: 'Mike MC', totalProfit: 1900 },
      { date: '2024-12-14', dealNumber: '157017', stockNumber: 'H25040', make: 'Honda', model: 'HR-V Sport', year: 2025, customerName: 'BROWN, EMILY', salesPerson: 'Anthony E', totalProfit: 2200 },
    ],
    pace: { total: { sold: totalUnits, goal: totalGoal, needed: totalGoal - totalUnits, pacePerDay: (totalGoal - totalUnits) / (daysInMonth - daysElapsed), onTrack: (totalUnits / totalGoal) >= (daysElapsed / daysInMonth) } },
  };
}
