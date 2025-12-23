
import { GoogleGenAI } from "@google/genai";

export interface SynthesisResult {
  code: string;
  explanation: string;
  simulatedScale: string;
}

/**
 * Synthesizes a dynamic, scalable algorithm based on a visual character matrix.
 * Uses a matrix-first approach where the grid is initialized and filled logically.
 */
export const synthesizePattern = async (
  grid: string[][],
  width: number,
  height: number,
  language: string
): Promise<SynthesisResult> => {
  const apiKey = (process.env as any).API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Map coordinates to help the AI recognize geometric relationships
  const coordinateMap: Record<string, string[]> = {};
  grid.forEach((row, i) => {
    row.forEach((char, j) => {
      if (char !== ' ') {
        if (!coordinateMap[char]) coordinateMap[char] = [];
        coordinateMap[char].push(`[${i},${j}]`);
      }
    });
  });

  const gridString = grid.map(row => row.join('')).join('\n');

  const prompt = `
    SYSTEM: You are a world-class Algorithm Architect and Logic Synthesizer.
    
    TASK: Analyze the provided ${width}x${height} visual character pattern and create a purely dynamic, scalable ${language} script to reproduce it for any input size 'n'.
    
    INPUT DATA:
    - Sample Grid Size: ${width} (Width) x ${height} (Height)
    - Visual representation:
    ${gridString}
    
    - Coordinate Map (Symbol: [row, col] list):
    ${Object.entries(coordinateMap).map(([s, coords]) => `${s}: ${coords.join(' ')}`).join('\n')}

    ARCHITECTURAL RULES FOR THE GENERATED CODE:
    1. MATRIX-FIRST APPROACH: The script MUST initialize a 2D matrix (array of arrays) of characters filled with spaces ' ' first.
    2. DYNAMIC DIMENSIONS: Calculate the total_rows and width of this matrix as a mathematical function of the user input 'n'.
    3. LOGICAL SEGMENTATION: Organize the filling logic into clear, commented parts (e.g., # Part 1: Boundaries, # Part 2: Inner Symmetries).
    4. NO HARDCODING: Do not use hardcoded indices from the ${width}x${height} sample. Every index must be derived from 'n'.
    5. COMPLETE SCRIPT: The code must include a way to get user input (stdin), call the pattern logic, and print the resulting matrix.
    6. CLEAN OUTPUT: The generated function should be robust and handle edge cases (n < 2).

    OUTPUT FORMAT (STRICT JSON):
    {
      "code": "A complete, standalone ${language} script following the matrix-initialization pattern.",
      "explanation": "A precise mathematical description of the row/column logic identified.",
      "simulated_output_n5": "A visual string of what the pattern looks like for n=5."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1, // High precision for logic synthesis
      },
    });

    const result = JSON.parse(response.text || '{}');
    return {
      code: result.code || `// Synthesis failed to generate code.`,
      explanation: result.explanation || 'Derived pattern logic from coordinates.',
      simulatedScale: result.simulated_output_n5 || 'N/A'
    };
  } catch (error) {
    console.error("Gemini Synthesis Error:", error);
    throw error;
  }
};
