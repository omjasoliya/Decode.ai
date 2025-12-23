
import React from 'react';
import { CHARACTER_OPTIONS } from '../constants';

interface CharacterPoolProps {
  selectedChars: string[];
  onToggleChar: (char: string) => void;
}

const CharacterPool: React.FC<CharacterPoolProps> = ({ selectedChars, onToggleChar }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
      <h2 className="text-lg font-semibold mb-4 text-slate-200">1. Select Character Pool</h2>
      <p className="text-sm text-slate-400 mb-4">Choose characters you want to use in your pattern.</p>
      <div className="grid grid-cols-3 gap-2">
        {CHARACTER_OPTIONS.map((opt) => (
          <button
            key={opt.char}
            onClick={() => onToggleChar(opt.char)}
            disabled={opt.char === ' '} // Space is mandatory
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
              ${selectedChars.includes(opt.char)
                ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/20'
                : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500'
              }
              ${opt.char === ' ' ? 'cursor-not-allowed opacity-80' : ''}
            `}
          >
            {opt.icon}
            <span className="text-xs font-medium">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CharacterPool;
