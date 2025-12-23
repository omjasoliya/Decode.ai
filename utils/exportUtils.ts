
import { GridData } from '../types';

/**
 * Generates a PNG image from the grid data using Canvas API
 */
export const exportGridToPng = (grid: GridData, cellSize: number = 40): string => {
  if (!grid || grid.length === 0) return '';
  const height = grid.length;
  const width = grid[0].length;
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';

  canvas.width = width * cellSize;
  canvas.height = height * cellSize;

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Borders & Text
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.fillStyle = '#1e293b';
  ctx.font = `${Math.floor(cellSize * 0.6)}px "Fira Code", monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  grid.forEach((row, rowIndex) => {
    row.forEach((char, colIndex) => {
      const x = colIndex * cellSize;
      const y = rowIndex * cellSize;
      ctx.strokeRect(x, y, cellSize, cellSize);
      if (char !== ' ') {
        ctx.fillText(char, x + cellSize / 2, y + cellSize / 2);
      }
    });
  });

  return canvas.toDataURL('image/png');
};

/**
 * Trigger browser download for a PNG
 */
export const downloadPng = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
};

/**
 * Trigger browser download for a code script
 */
export const downloadScript = (code: string, language: string) => {
  const extensions: Record<string, string> = {
    python: 'py',
    javascript: 'js',
    c: 'c',
    cpp: 'cpp',
    java: 'java',
    golang: 'go',
    ruby: 'rb'
  };
  
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `pattern_gen.${extensions[language] || 'txt'}`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
};
