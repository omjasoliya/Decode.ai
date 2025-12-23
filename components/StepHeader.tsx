
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StepHeaderProps {
  title: string;
  desc: string;
  icon: LucideIcon;
}

const StepHeader: React.FC<StepHeaderProps> = ({ title, desc, icon: Icon }) => (
  <div className="text-center mb-10 max-w-2xl mx-auto px-4">
    <div className="inline-flex p-4 bg-green-50 rounded-full mb-6 text-green-600 border border-green-100">
      <Icon className="w-8 h-8" />
    </div>
    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 leading-none">{title}</h2>
    <p className="text-slate-500 text-lg opacity-80 leading-relaxed font-medium">{desc}</p>
  </div>
);

export default StepHeader;
