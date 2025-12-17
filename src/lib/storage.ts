import { MonthlyGoals, SpiffCar } from '@/types';

const GOALS_KEY = 'honda-goals';
const SPIFFS_KEY = 'honda-spiffs';
const SHEETS_CONFIG_KEY = 'honda-sheets-config';
const INDIVIDUAL_GOALS_KEY = 'honda-individual-goals';

const defaultGoals: MonthlyGoals = {
  id: '1',
  month: new Date().toLocaleString('default', { month: 'long' }),
  year: new Date().getFullYear(),
  totalGoal: 70,
  totalCurrent: 0,
  totalGrossGoal: 150000,
  bonusPerPerson: 500,
  minVehiclesForBonus: 8,
  lastUpdated: new Date().toISOString(),
};

const defaultSpiffs: SpiffCar[] = [
  { id: '1', stockNumber: 'H25001', vehicle: '2024 Honda Accord Sport', age: 95, spiffAmount: 400, msrp: 32500, notes: 'Great color combo' },
  { id: '2', stockNumber: 'H25002', vehicle: '2024 Honda CR-V Touring', age: 88, spiffAmount: 350, msrp: 38900 },
  { id: '3', stockNumber: 'H25003', vehicle: '2024 Honda Pilot TrailSport', age: 75, spiffAmount: 300, msrp: 49500 },
];

export function getGoals(): MonthlyGoals {
  if (typeof window === 'undefined') return defaultGoals;
  const stored = localStorage.getItem(GOALS_KEY);
  if (!stored) { saveGoals(defaultGoals); return defaultGoals; }
  try {
    const parsed = JSON.parse(stored);
    return { ...defaultGoals, ...parsed, totalGoal: Number(parsed.totalGoal) || defaultGoals.totalGoal, totalGrossGoal: Number(parsed.totalGrossGoal) || defaultGoals.totalGrossGoal, bonusPerPerson: Number(parsed.bonusPerPerson) || defaultGoals.bonusPerPerson, minVehiclesForBonus: Number(parsed.minVehiclesForBonus) || defaultGoals.minVehiclesForBonus };
  } catch { return defaultGoals; }
}

export function saveGoals(goals: MonthlyGoals): void {
  if (typeof window === 'undefined') return;
  goals.lastUpdated = new Date().toISOString();
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export function getSpiffs(): SpiffCar[] {
  if (typeof window === 'undefined') return defaultSpiffs;
  const stored = localStorage.getItem(SPIFFS_KEY);
  if (!stored) { saveSpiffs(defaultSpiffs); return defaultSpiffs; }
  try { return JSON.parse(stored); } catch { return defaultSpiffs; }
}

export function saveSpiffs(spiffs: SpiffCar[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SPIFFS_KEY, JSON.stringify(spiffs));
}

export interface SheetsConfig { webAppUrl: string; refreshInterval: number; }

const defaultSheetsConfig: SheetsConfig = { webAppUrl: '', refreshInterval: 60 };

export function getSheetsConfig(): SheetsConfig {
  if (typeof window === 'undefined') return defaultSheetsConfig;
  const stored = localStorage.getItem(SHEETS_CONFIG_KEY);
  if (!stored) return defaultSheetsConfig;
  try { return { ...defaultSheetsConfig, ...JSON.parse(stored) }; } catch { return defaultSheetsConfig; }
}

export function saveSheetsConfig(config: SheetsConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SHEETS_CONFIG_KEY, JSON.stringify(config));
}

export interface IndividualGoal { name: string; targetUnits: number; targetProfit: number; lastUpdated: string; }

export function getIndividualGoals(): Record<string, IndividualGoal> {
  if (typeof window === 'undefined') return {};
  const stored = localStorage.getItem(INDIVIDUAL_GOALS_KEY);
  if (!stored) return {};
  try { return JSON.parse(stored); } catch { return {}; }
}

export function saveIndividualGoal(name: string, goal: Partial<IndividualGoal>): void {
  if (typeof window === 'undefined') return;
  const goals = getIndividualGoals();
  goals[name] = { name, targetUnits: goal.targetUnits || 8, targetProfit: goal.targetProfit || 15000, lastUpdated: new Date().toISOString() };
  localStorage.setItem(INDIVIDUAL_GOALS_KEY, JSON.stringify(goals));
}

export function getIndividualGoal(name: string): IndividualGoal | null {
  const goals = getIndividualGoals();
  return goals[name] || null;
}
