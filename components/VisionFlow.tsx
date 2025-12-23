
import React from 'react';
import { Camera, Terminal, Zap, ArrowRight } from 'lucide-react';

const VisionFlow: React.FC = () => {
  return (
    <div className="relative w-full aspect-video bg-white rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl flex flex-col md:flex-row group">
      {/* Left Pane: The Physical Sketch (Input) */}
      <div className="relative w-full md:w-1/2 h-full bg-slate-50 flex flex-col items-center justify-center p-8 border-r border-slate-100 overflow-hidden">
        <div className="absolute top-6 left-8 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Capture</span>
        </div>
        
        <div className="relative w-48 h-48 border-2 border-slate-200 border-dashed rounded-2xl flex items-center justify-center p-4">
           <div className="grid grid-cols-5 gap-2 w-full h-full opacity-40">
             {Array.from({length: 25}).map((_, i) => (
               <div key={i} className={`bg-slate-300 rounded-sm ${i % 6 === 0 ? 'scale-110 opacity-100 bg-slate-400' : ''}`}></div>
             ))}
           </div>
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-32 h-32 border border-green-500/50 rounded-full animate-ping-slow"></div>
             <div className="absolute w-24 h-24 border-2 border-green-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)] bg-white/10 backdrop-blur-[2px]">
               <Camera className="w-8 h-8 text-green-500" />
             </div>
           </div>
        </div>
        <p className="mt-8 text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Recognizing Geometry...</p>
      </div>

      {/* Right Pane: The Neural Synthesis (Output) */}
      <div className="relative w-full md:w-1/2 h-full bg-slate-900 flex flex-col p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-2">
             <Terminal className="w-4 h-4 text-green-500" />
             <span className="text-[10px] font-black text-white uppercase tracking-widest">Synthesis Core</span>
           </div>
           <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
              <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Mapping Indices</span>
           </div>
        </div>

        <div className="flex-1 font-mono text-[10px] text-slate-400 space-y-2 relative">
           <div className="text-green-500"># Neural Formula Derived</div>
           <div className="text-pink-500 italic">def <span className="text-blue-400">generate_pattern</span>(n):</div>
           <div className="pl-4">matrix = [<span className="text-amber-500">[' ']*n for _ in range(n)</span>]</div>
           <div className="pl-4 text-pink-500 italic">for <span className="text-slate-300">i</span> in range(n):</div>
           <div className="pl-8 text-slate-300">matrix[i][i] = <span className="text-emerald-500">'*'</span></div>
           <div className="pl-8 text-slate-300">matrix[i][n-i-1] = <span className="text-emerald-500">'*'</span></div>
           <div className="pl-4 text-pink-500 italic">return <span className="text-slate-300">matrix</span></div>
           <div className="absolute top-1/2 left-0 w-full h-12 bg-green-500/5 border-y border-green-500/10 animate-scan-fast pointer-events-none"></div>
        </div>

        <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4">
           <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-500" />
           </div>
           <div>
              <p className="text-[9px] font-black text-white uppercase tracking-widest">Pattern Found</p>
              <p className="text-[8px] font-medium text-slate-500 uppercase">Cross-Diagonal Matrix</p>
           </div>
        </div>
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex w-12 h-12 bg-white rounded-full items-center justify-center border-4 border-slate-50 shadow-xl z-10 text-slate-400 group-hover:text-green-500 transition-colors">
         <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );
};

export default VisionFlow;
