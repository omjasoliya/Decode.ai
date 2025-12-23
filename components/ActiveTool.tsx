
import React from 'react';

interface ActiveToolProps {
  selectedChars: string[];
  activeChar: string;
  setActiveChar: (char: string) => void;
}

const ActiveTool: React.FC<ActiveToolProps> = ({ selectedChars, activeChar, setActiveChar }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
      <h2 className="text-lg font-semibold mb-4 text-slate-200">2. Active Brush</h2>
      <div className="flex flex-wrap gap-2">
        {selectedChars.map((char) => (
          <button
            key={char}
            onClick={() => setActiveChar(char)}
            className={`
              w-10 h-10 flex items-center justify-center rounded-lg border font-mono text-xl transition-all
              ${activeChar === char
                ? 'bg-emerald-600 border-emerald-400 text-white scale-110'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
              }
            `}
          >
            {char === ' ' ? '␣' : char}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ActiveTool;
