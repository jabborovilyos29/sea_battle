export interface Ship {
  id: string;
  size: number;
  positions: number[];
  placed: boolean;
}

export interface BattleState {
  grid: number[][];
  ships: Ship[];
}
