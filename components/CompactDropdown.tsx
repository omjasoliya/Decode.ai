
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface CompactDropdownProps {
  value: any;
  options: any[];
  onChange: (val: any) => void;
  label?: string;
  disabled?: boolean;
}

const CompactDropdown: React.FC<CompactDropdownProps> = ({ value, options, onChange, label, disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative flex-1 ${disabled ? 'opacity-50 grayscale pointer-events-none' : ''}`} ref={containerRef}>
      {label && <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-slate-50 border px-5 py-4 rounded-xl flex items-center justify-between transition-all outline-none ${isOpen ? 'border-green-500 bg-white ring-1 ring-green-500/20 shadow-md' : 'border-slate-200 hover:border-green-300'}`}
      >
        <span className="font-bold text-lg text-slate-800">{value}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-green-500' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-2xl max-h-48 overflow-y-auto animate-fade-in ring-1 ring-slate-200/50">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              className={`w-full text-left px-5 py-3 flex items-center justify-between transition-all font-bold border-b border-slate-50 last:border-0 ${value === opt ? 'bg-green-50 text-green-600' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
            >
              <span>{opt}</span>
              {value === opt && <Check className="w-3 h-3" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompactDropdown;
