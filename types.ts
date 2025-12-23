
export type GridData = string[][];

export interface AppState {
  gridWidth: number;
  gridHeight: number;
  availableChars: string[];
  selectedChars: string[];
  activeChar: string;
  grid: GridData;
}
