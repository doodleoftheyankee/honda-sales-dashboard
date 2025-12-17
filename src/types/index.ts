export interface MonthlyGoals {
  id: string;
  month: string;
  year: number;
  totalGoal: number;
  totalCurrent: number;
  totalGrossGoal: number;
  bonusPerPerson: number;
  minVehiclesForBonus: number;
  lastUpdated: string;
}

export interface SpiffCar {
  id: string;
  stockNumber: string;
  vehicle: string;
  age: number;
  spiffAmount: number;
  msrp: number;
  notes?: string;
}

export interface Salesperson {
  id: string;
  name: string;
  nickname: string;
}
