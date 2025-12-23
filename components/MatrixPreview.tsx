
import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2 } from 'lucide-react';

interface MatrixPreviewProps {
  grid: string[][];
  customCode?: string;
  language?: string;
}

const MatrixPreview: React.FC<MatrixPreviewProps> = ({ grid, customCode, language = 'python' }) => {
  const [copied, setCopied] = useState(false);
  
  const codeToDisplay = customCode || `matrix = [\n${grid.map(row => `  [${row.map(c => `'${c}'`).join(', ')}]`).join(',\n')}\n]`;

  const handleCopy = () => {
    navigator.clipboard.writeText(codeToDisplay);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getHighlightedCode = (code: string) => {
    return code
      .replace(/\[/g, '<span class="text-amber-600">[</span>')
      .replace(/\]/g, '<span class="text-amber-600">]</span>')
      .replace(/'(.*?)'/g, '<span class="text-emerald-600">\'$1\'</span>')
      .replace(/"(.*?)"/g, '<span class="text-emerald-600">"$1"</span>')
      .replace(/\b(def|function|func|fn|class|public|static|void|int|var|let|const|return|if|else|for|while|range|println|fmt|print)\b/g, '<span class="text-pink-600">$1</span>')
      .replace(/\b(n|grid|matrix|row|col|i|j)\b/g, '<span class="text-blue-500 italic">$1</span>')
      .replace(/(\/\/.*|\#.*)/g, '<span class="text-slate-400">$1</span>');
  };

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 shadow-inner overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center border border-green-100">
            <Code2 className="w-4 h-4 text-green-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 tracking-tight">Algorithm</h4>
            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">{language} source</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className={`
            flex items-center gap-2 text-[10px] font-black px-4 py-2 rounded-xl transition-all
            ${copied 
              ? 'bg-green-50 text-green-600 border border-green-100' 
              : 'bg-green-500 hover:bg-green-600 text-white shadow-sm active:scale-95'
            }
          `}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'COPIED' : 'COPY'}
        </button>
      </div>
      <div className="flex-1 relative overflow-hidden">
        <pre 
          className="p-6 text-sm font-mono leading-relaxed overflow-auto h-full max-h-[500px] text-slate-700"
          dangerouslySetInnerHTML={{ __html: getHighlightedCode(codeToDisplay) }}
        />
      </div>
    </div>
  );
};

export default MatrixPreview;
