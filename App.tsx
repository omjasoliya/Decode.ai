
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { 
  Terminal, ArrowRight, Home, Layers, Palette, 
  CheckCircle, Trash2, ArrowLeft, Wand2, Printer,
  Layers2, Info, ShieldAlert, Mail, Send,
  Search, Calendar, Clock, ChevronRight, Menu, X, Check, Lock, Unlock,
  ZoomIn, Camera, Binary, Sparkles, RefreshCw, CheckCircle2,
  MousePointer2
} from 'lucide-react';
import { GRID_RANGE, INITIAL_CHARS, CHARACTER_OPTIONS, ALPHABETS, NUMBERS } from './constants';
import { GridData } from './types';
import MatrixPreview from './components/MatrixPreview';
import { exportGridToPng, downloadPng } from './utils/exportUtils';
import { synthesizePattern } from './gemini_services';

// Modular Imports
import VisionFlow from './components/VisionFlow';
import MatrixRain from './components/MatrixRain';
import CompactDropdown from './components/CompactDropdown';
import StepHeader from './components/StepHeader';

const LANGUAGES = [
  { id: 'python', name: 'Python' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'cpp', name: 'C++' },
  { id: 'java', name: 'Java' },
  { id: 'golang', name: 'Go' },
];

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Art of ASCII Logic in Modern Computing",
    excerpt: "Exploring how simple character sets can represent complex mathematical structures and why they still matter in the age of high-resolution graphics.",
    content: `
      <p>In the early days of computing, before graphical user interfaces (GUIs) were common, ASCII art was more than just a creative hobby—it was the primary way to convey visual information.</p>
      <h3>Why Character Patterns Matter</h3>
      <p>Character patterns represent the most basic form of visual abstraction. They force us to think in terms of grids and logic. When you design a pattern in Decode AI, you're not just placing characters; you're defining a spatial relationship that can be translated into code.</p>
      <blockquote>"Complexity is born from simple rules repeated in space."</blockquote>
      <p>By using AI to synthesize these patterns, we allow students to bridge the gap between their visual imagination and the programmatic reality of their designs.</p>
    `,
    tag: "Education",
    date: "Oct 24, 2023",
    readTime: "5 min read",
    author: "Dr. Elena Vance",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "AI Synthesis: How LLMs Understand Visual Grids",
    excerpt: "Exploring how large language models translate visual character grids into dynamic scaling functions across multiple programming languages.",
    content: `
      <p>Large Language Models (LLMs) have shown a surprising ability to understand spatial patterns when represented as text. When we feed a character grid into our synthesis engine, the model treats the layout as a 2D matrix of symbols.</p>
      <h3>Generating Scalable Logic</h3>
      <p>Once the pattern is understood, the model attempts to generalize it. Instead of hardcoding a 10x10 matrix, it creates a function <code>generate_pattern(n)</code>. This requires the model to understand the 'physics' of the pattern—how it grows as 'n' increases.</p>
    `,
    tag: "Technology",
    date: "Nov 12, 2023",
    readTime: "8 min read",
    author: "Marcus Thorne",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800"
  }
];

const App: React.FC = () => {
  const [step, setStep] = useState(0); 
  const [view, setView] = useState<'app' | 'blog' | 'blog-post'>('app');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState<typeof BLOG_POSTS[0] | null>(null);
  const [blogSearch, setBlogSearch] = useState("");
  
  const [gridWidth, setGridWidth] = useState(10);
  const [gridHeight, setGridHeight] = useState(10);
  const [isSquareMode, setIsSquareMode] = useState(true);
  const [canvasZoom, setCanvasZoom] = useState(36); 

  const [selectedChars, setSelectedChars] = useState<string[]>(INITIAL_CHARS);
  const [activeChar, setActiveChar] = useState<string>('*');
  const [grid, setGrid] = useState<GridData>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedLogic, setGeneratedLogic] = useState<{ code: string; explanation: string; simulatedScale: string } | null>(null);
  const [selectedLang, setSelectedLang] = useState('python');
  const gridRef = useRef<HTMLDivElement>(null);

  const resetGrid = useCallback((w: number, h: number) => {
    const newGrid = Array.from({ length: h }, () =>
      Array.from({ length: w }, () => ' ')
    );
    setGrid(newGrid);
  }, []);

  useEffect(() => {
    if (step === 3 && (grid.length !== gridHeight || (grid[0]?.length || 0) !== gridWidth)) {
      resetGrid(gridWidth, gridHeight);
    }
  }, [gridWidth, gridHeight, step, resetGrid]);

  const updateCell = useCallback((row: number, col: number) => {
    setGrid(prev => {
      if (!prev[row] || prev[row][col] === activeChar) return prev;
      const next = prev.map(r => [...r]);
      next[row][col] = activeChar;
      return next;
    });
  }, [activeChar]);

  const handleMouseDown = (row: number, col: number) => {
    setIsDrawing(true);
    updateCell(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isDrawing) updateCell(row, col);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDrawing) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (element && element.hasAttribute('data-row') && element.hasAttribute('data-col')) {
      const r = parseInt(element.getAttribute('data-row')!);
      const c = parseInt(element.getAttribute('data-col')!);
      updateCell(r, c);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDrawing(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const generateDynamicCode = async (lang: string) => {
    setIsProcessing(true);
    try {
      const result = await synthesizePattern(grid, gridWidth, gridHeight, lang);
      setGeneratedLogic(result);
    } catch (err) {
      console.error("Synthesis Error:", err);
      setGeneratedLogic({
        code: '// Critical Synthesis Error: The pattern was too complex.',
        explanation: 'Failed to derive formula.',
        simulatedScale: '??'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredBlogPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => 
      post.title.toLowerCase().includes(blogSearch.toLowerCase()) || 
      post.excerpt.toLowerCase().includes(blogSearch.toLowerCase()) ||
      post.tag.toLowerCase().includes(blogSearch.toLowerCase())
    );
  }, [blogSearch]);

  const currentResultImage = useMemo(() => (step >= 4 ? exportGridToPng(grid) : ''), [grid, step]);

  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const performScroll = () => {
      const element = document.getElementById(id);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    };

    if (view !== 'app' || step !== 0) {
      setView('app');
      setStep(0);
      setTimeout(performScroll, 100);
    } else {
      performScroll();
    }
  };

  const handleOpenBlog = (post: typeof BLOG_POSTS[0]) => {
    setSelectedBlogPost(post);
    setView('blog-post');
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseBlog = () => {
    setView('blog');
    setSelectedBlogPost(null);
  };

  const removeCharFromPool = (char: string) => {
    if (char === ' ') return;
    setSelectedChars(prev => prev.filter(c => c !== char));
    if (activeChar === char) setActiveChar(' ');
  };

  const updateWidth = (w: number) => {
    setGridWidth(w);
    if (isSquareMode) setGridHeight(w);
  };

  const updateHeight = (h: number) => {
    setGridHeight(h);
    if (isSquareMode) setGridWidth(h);
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-slate-800 overflow-x-hidden">
      
      {/* Global Navbar */}
      <header className={`fixed top-0 left-0 w-full z-[500] transition-all duration-300 ${step === 0 ? 'bg-black/95 backdrop-blur-md border-b border-white/5 shadow-sm' : 'h-1 bg-slate-100'}`}>
        {step === 0 ? (
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => {setView('app'); setStep(0); window.scrollTo({top: 0, behavior: 'smooth'});}}>
              <div className="p-2 bg-green-500 rounded-lg shadow-lg shadow-green-500/20">
                <Terminal className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white">Decode <span className="text-green-500">AI</span></span>
            </div>

            <nav className="hidden md:flex items-center gap-10">
              <button onClick={() => scrollToSection('how-to')} className="text-sm font-bold text-slate-400 hover:text-green-500 transition-colors uppercase tracking-widest">Guide</button>
              <button onClick={() => { setView('blog'); setStep(0); setIsMenuOpen(false); }} className={`text-sm font-bold ${view === 'blog' || view === 'blog-post' ? 'text-green-500' : 'text-slate-400'} hover:text-green-500 transition-colors uppercase tracking-widest`}>Insights</button>
              <button onClick={() => scrollToSection('contact')} className="text-sm font-bold text-slate-400 hover:text-green-500 transition-colors uppercase tracking-widest">Support</button>
              <button 
                onClick={() => {setView('app'); setStep(1);}}
                className="px-6 py-3 bg-green-500 text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-green-500/10 active:scale-95 ml-4"
              >
                Launch Studio
              </button>
            </nav>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-white hover:text-green-500 transition-colors">
              {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        ) : (
          <div className="h-full bg-green-500 transition-all duration-700 shadow-sm" style={{ width: `${(step / 5) * 100}%` }} />
        )}
      </header>

      {/* Mobile Menu */}
      {step === 0 && isMenuOpen && (
        <div className="fixed inset-0 z-[490] bg-black animate-fade-in md:hidden pt-24 px-6">
           <nav className="flex flex-col gap-8 text-center text-white">
             <button onClick={() => scrollToSection('how-to')} className="text-2xl font-black uppercase tracking-tighter">Guide</button>
             <button onClick={() => {setView('blog'); setIsMenuOpen(false);}} className="text-2xl font-black uppercase tracking-tighter">Insights</button>
             <button onClick={() => scrollToSection('contact')} className="text-2xl font-black uppercase tracking-tighter">Support</button>
             <div className="pt-8 border-t border-white/10">
                <button onClick={() => {setView('app'); setStep(1); setIsMenuOpen(false);}} className="w-full py-6 bg-green-500 text-white font-black rounded-2xl text-lg uppercase tracking-widest shadow-xl shadow-green-500/20">
                  Enter the lab
                </button>
             </div>
           </nav>
        </div>
      )}

      <main className={`flex flex-col items-center justify-center min-h-screen ${step === 3 && view === 'app' ? 'p-0' : ''}`}>
        
        {/* VIEW: INSIGHTS (BLOG) */}
        {view === 'blog' && (
          <div className="w-full pt-40 pb-20 px-6 animate-fade-in">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                <div className="max-w-2xl">
                  <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none italic mb-6">Pattern <span className="text-green-500">Insights</span></h1>
                  <p className="text-xl text-slate-500 font-medium leading-relaxed opacity-70">Deep dives into the architecture of code, AI synthesis, and visual logic.</p>
                </div>
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input type="text" placeholder="Search articles..." value={blogSearch} onChange={(e) => setBlogSearch(e.target.value)} className="w-full bg-white border border-slate-200 pl-14 pr-6 py-5 rounded-[2rem] outline-none focus:border-green-500 shadow-sm focus:shadow-xl transition-all font-bold text-slate-700" />
                </div>
              </div>

              {filteredBlogPosts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                  {filteredBlogPosts.map((post) => (
                    <article key={post.id} className="group bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-pointer flex flex-col" onClick={() => handleOpenBlog(post)}>
                      <div className="aspect-[16/10] overflow-hidden relative">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        <div className="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur shadow-sm rounded-full text-[10px] font-black uppercase text-green-600 tracking-widest">{post.tag}</div>
                      </div>
                      <div className="p-10 flex flex-col flex-1">
                        <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-green-600 transition-colors leading-tight">{post.title}</h2>
                        <p className="text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3">{post.excerpt}</p>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs font-bold text-slate-600">{post.author}</div>
                          <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-40">
                  <Search className="w-16 h-16 mx-auto mb-8 text-slate-200" />
                  <h3 className="text-3xl font-black text-slate-900 mb-4">No results found</h3>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: INSIGHT DETAIL */}
        {view === 'blog-post' && selectedBlogPost && (
          <div className="w-full pt-40 pb-20 px-6 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <button onClick={handleCloseBlog} className="group flex items-center gap-3 text-sm font-black text-slate-400 hover:text-green-600 transition-all uppercase tracking-widest mb-12">
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> Back to Insights
              </button>
              <div className="aspect-[21/9] rounded-[3rem] overflow-hidden mb-12 shadow-2xl">
                <img src={selectedBlogPost.image} alt={selectedBlogPost.title} className="w-full h-full object-cover" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight mb-8">{selectedBlogPost.title}</h1>
              <div className="flex items-center gap-6 text-[10px] font-black text-green-600 uppercase tracking-widest mb-12">
                <span className="px-4 py-2 bg-green-50 rounded-full">{selectedBlogPost.tag}</span>
                <span className="text-slate-400">{selectedBlogPost.date}</span>
                <span className="text-slate-400">{selectedBlogPost.readTime}</span>
              </div>
              <div className="prose prose-lg max-w-none text-slate-600 font-medium leading-[1.8] space-y-8" dangerouslySetInnerHTML={{ __html: selectedBlogPost.content }} />
            </div>
          </div>
        )}

        {/* VIEW: STUDIO FLOW */}
        {view === 'app' && (
          <>
            {/* Step 0: Landing */}
            {step === 0 && (
              <div className="w-full">
                <section className="relative pt-40 pb-32 px-6 text-center animate-fade-in bg-black overflow-hidden flex flex-col items-center justify-center min-h-[700px]">
                  <MatrixRain />
                  <div className="max-w-5xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-10 backdrop-blur-sm">
                       <Sparkles className="w-3 h-3" /> Neural Pattern Synthesis v4.0
                    </div>
                    <h1 className="text-7xl md:text-[11rem] font-black text-white mb-6 tracking-tighter leading-none italic select-none">Decode <span className="text-green-500">AI</span></h1>
                    <div className="relative inline-block mb-16">
                      <p className="text-2xl md:text-5xl text-green-500 font-black tracking-tight leading-relaxed max-w-4xl mx-auto italic animate-tubelight">“Where Hidden Patterns Become Clear.”</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4">
                      <button onClick={() => setStep(1)} className="group relative px-14 py-7 bg-green-500 text-white text-xl md:text-2xl font-black rounded-[2rem] hover:bg-green-400 hover:scale-[1.02] transition-all shadow-2xl shadow-green-500/30 flex items-center gap-4 active:scale-95">
                        DECODE NOW <ArrowRight className="w-8 h-8" />
                      </button>
                      <button onClick={() => scrollToSection('how-to')} className="px-10 py-7 bg-white/5 border border-white/10 text-white text-xl font-black rounded-[2rem] hover:bg-white/10 transition-all flex items-center gap-3 backdrop-blur-md">
                        HOW IT WORKS <Info className="w-6 h-6 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </section>

                <section id="how-to" className="py-32 px-6 bg-slate-50/50 scroll-mt-20">
                  <div className="max-w-7xl mx-auto text-center">
                    <h3 className="text-xs font-black text-green-500 uppercase tracking-[0.4em] mb-4">The Workflow</h3>
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-20">The Architecture of Logic</h2>
                    <div className="grid md:grid-cols-4 gap-8 text-left">
                      {[
                        { icon: Layers, title: "1. Canvas", desc: "Configure your rectangular or square matrix geometry." },
                        { icon: Palette, title: "2. Toolkit", desc: "Choose characters or symbols for your design repository." },
                        { icon: MousePointer2, title: "3. Design", desc: "Paint your pattern onto the grid with precision tools." },
                        { icon: Terminal, title: "4. Synthesize", desc: "AI transforms your visual pattern into scalable dynamic code." }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-600 group-hover:scale-110 transition-transform">
                            <item.icon className="w-8 h-8" />
                          </div>
                          <h4 className="text-xl font-black text-slate-900 mb-4">{item.title}</h4>
                          <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="py-32 px-6 bg-white overflow-hidden">
                   <div className="max-w-7xl mx-auto">
                      <div className="flex flex-col lg:flex-row items-center gap-16 mb-20">
                         <div className="lg:w-1/2">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8">
                               <Camera className="w-4 h-4" /> Neural Vision Engine
                            </div>
                            <h2 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none italic mb-10">
                              Pattern Image <span className="text-green-500">to Source</span>
                            </h2>
                            <p className="text-slate-500 text-xl font-medium leading-relaxed mb-12 italic max-w-xl">
                              Bridge the gap between your sketches and your IDE. Our upcoming vision engine translates hand-drawn patterns into scalable algorithmic logic instantly.
                            </p>
                            <div className="flex items-center gap-6">
                               <div className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl flex items-center gap-2">
                                  is Coming Soon | 🕵️
                               </div>
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <Binary className="w-4 h-4 text-green-500" /> Phase: Integration
                               </span>
                            </div>
                         </div>
                         <div className="lg:w-1/2 w-full">
                            <VisionFlow />
                         </div>
                      </div>
                   </div>
                </section>

                <section id="contact" className="py-32 px-6 bg-slate-50 scroll-mt-20">
                  <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col md:flex-row">
                      <div className="md:w-1/2 p-12 md:p-20 bg-slate-900 text-white flex flex-col justify-between">
                        <div>
                          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8 leading-none italic">Let's <span className="text-green-500">Connect</span></h2>
                          <p className="text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-md">Queries about our Neural Synthesis Engine? Reach out to our architects.</p>
                        </div>
                        <div className="mt-12 space-y-6"><div className="flex items-center gap-4 text-slate-300"><Mail className="w-6 h-6 text-green-500" /> architect@decode-ai.io</div></div>
                      </div>
                      <div className="md:w-1/2 p-12 md:p-20">
                        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <input type="text" placeholder="Identity" className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-green-500 transition-all font-bold" />
                            <input type="email" placeholder="Endpoint" className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-green-500 transition-all font-bold" />
                          </div>
                          <textarea placeholder="Transmission details..." rows={5} className="w-full bg-slate-50 border border-slate-200 px-6 py-4 rounded-xl outline-none focus:border-green-500 transition-all font-bold resize-none"></textarea>
                          <button className="w-full py-6 bg-green-500 text-white font-black rounded-xl text-lg uppercase tracking-widest shadow-xl shadow-green-500/20 hover:bg-green-600 transition-all flex items-center justify-center gap-3">
                            SEND SIGNAL <Send className="w-5 h-5" />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </section>
                <footer className="bg-white py-20 border-t border-slate-100 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">© 2024 DECODE AI LABS. ALL SYSTEMS ACTIVE.</footer>
              </div>
            )}

            {/* Step 1: Geometry Selection */}
            {step === 1 && (
              <div className="w-full max-w-2xl animate-fade-in pt-40 pb-20">
                <StepHeader icon={Layers} title="Grid Geometry" desc="Architect your canvas dimensions (4x4 to 20x20)." />
                <div className="bg-white border border-slate-100 p-8 md:p-12 rounded-[2.5rem] shadow-xl space-y-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Dimension Link</span>
                    <button onClick={() => { const next = !isSquareMode; setIsSquareMode(next); if (next) setGridHeight(gridWidth); }} className={`flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${isSquareMode ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
                      {isSquareMode ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      {isSquareMode ? 'Square (Locked)' : 'Custom (Unlocked)'}
                    </button>
                  </div>
                  <div className="flex gap-4 items-end">
                    <CompactDropdown label="Width" value={gridWidth} options={GRID_RANGE} onChange={updateWidth} />
                    <div className="pb-5 font-black text-slate-300 text-xl">×</div>
                    <CompactDropdown label="Height" value={gridHeight} options={GRID_RANGE} onChange={updateHeight} disabled={isSquareMode} />
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10 flex items-center justify-center min-h-[300px] shadow-inner relative overflow-hidden group">
                    <div className="grid bg-white border border-slate-200 shadow-sm transition-all duration-500" style={{ gridTemplateColumns: `repeat(${gridWidth}, 1fr)`, width: 'min(100%, 250px)', aspectRatio: `${gridWidth} / ${gridHeight}` }}>
                      {Array.from({ length: gridWidth * gridHeight }).map((_, i) => <div key={i} className="border-[0.5px] border-slate-100" />)}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setStep(0)} className="px-8 py-6 bg-slate-100 text-slate-500 font-black rounded-2xl flex items-center justify-center transition-all hover:bg-slate-200"><Home className="w-6 h-6" /></button>
                    <button onClick={() => setStep(2)} className="flex-1 py-6 bg-green-500 hover:bg-green-600 text-white font-black text-xl rounded-2xl shadow-lg flex items-center justify-center gap-3">BUILD TOOLKIT <ArrowRight className="w-6 h-6" /></button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Toolkit Setup */}
            {step === 2 && (
              <div className="w-full max-w-4xl animate-fade-in pt-40 pb-20 px-4">
                <StepHeader icon={Palette} title="Toolkit Setup" desc="Define your character repository." />
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-xl">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 text-center">Standard Glyphs</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {CHARACTER_OPTIONS.map(opt => (
                        <button key={opt.char} disabled={opt.char === ' '} onClick={() => setSelectedChars(prev => prev.includes(opt.char) ? prev.filter(c => c !== opt.char) : [...prev, opt.char])} className={`group p-6 rounded-2xl border transition-all flex flex-col items-center gap-2 ${selectedChars.includes(opt.char) ? 'bg-green-500 border-green-400 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-green-300 hover:bg-green-50/30'}`}>
                          {opt.icon} <span className="text-[10px] font-bold uppercase">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-xl">
                       <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 text-center">Add Custom Glyphs</h3>
                       <div className="grid grid-cols-1 gap-4">
                          <select onChange={(e) => { if (e.target.value && !selectedChars.includes(e.target.value)) setSelectedChars([...selectedChars, e.target.value]); e.target.value = ""; }} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-700 font-bold focus:border-green-400 outline-none">
                            <option value="">Add Letters...</option>
                            {ALPHABETS.map(a => <option key={a} value={a}>{a}</option>)}
                          </select>
                          <select onChange={(e) => { if (e.target.value && !selectedChars.includes(e.target.value)) setSelectedChars([...selectedChars, e.target.value]); e.target.value = ""; }} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-700 font-bold focus:border-green-400 outline-none">
                            <option value="">Add Numbers...</option>
                            {NUMBERS.map(n => <option key={n} value={n}>{n}</option>)}
                          </select>
                       </div>
                    </div>
                    <div className="bg-green-50/50 p-6 rounded-3xl border border-green-100 flex-1">
                       <h4 className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-4">Active Pool</h4>
                       <div className="flex flex-wrap gap-2">
                          {selectedChars.map(c => (
                            <button key={c} onClick={() => removeCharFromPool(c)} className={`group px-3 py-1.5 bg-white border border-green-100 rounded-lg text-sm font-mono text-slate-700 shadow-sm flex items-center gap-2 transition-all ${c === ' ' ? 'cursor-not-allowed opacity-40' : 'hover:border-red-200 hover:bg-red-50'}`} disabled={c === ' '}>
                              {c === ' ' ? 'SPC' : c} {c !== ' ' && <X className="w-3 h-3 text-slate-300 group-hover:text-red-500" />}
                            </button>
                          ))}
                       </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setStep(1)} className="px-8 py-6 bg-slate-100 text-slate-500 font-black rounded-2xl flex items-center justify-center transition-all hover:bg-slate-200"><ArrowLeft className="w-6 h-6" /></button>
                      <button onClick={() => { setStep(3); if (selectedChars.length > 1) setActiveChar(selectedChars.find(c => c !== ' ') || '*'); }} className="flex-1 py-6 bg-green-500 hover:bg-green-600 text-white font-black text-xl rounded-2xl shadow-lg active:scale-95 transition-all">GO TO LAB</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Drawing Studio */}
            {step === 3 && (
              <div className="fixed inset-0 bg-white flex flex-col z-[500] animate-fade-in overflow-hidden pt-1">
                <header className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 md:px-12 shrink-0 z-10">
                  <div className="flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-green-500" />
                    <div className="hidden sm:block">
                      <h2 className="font-black text-slate-900 text-sm tracking-tight uppercase leading-none">Decode Lab</h2>
                      <p className="text-[8px] font-black text-slate-400 tracking-widest uppercase mt-0.5">{gridWidth}x{gridHeight} Matrix</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* BACK BUTTON IN STUDIO */}
                    <button onClick={() => setStep(2)} className="group flex items-center gap-2 px-4 py-2 text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase transition-all">
                       <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Toolkit
                    </button>
                    <button onClick={() => setStep(4)} className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all flex items-center gap-2">VALIDATE <CheckCircle className="w-3.5 h-3.5" /></button>
                  </div>
                </header>
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                  <aside className="w-full md:w-64 border-b md:border-r border-slate-100 bg-slate-50/30 flex flex-col p-3 md:p-6 shrink-0 overflow-y-auto">
                    <div className="space-y-4 md:space-y-6">
                      <div>
                        <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 text-center italic">Active Brush</h3>
                        <div className="grid grid-cols-6 md:grid-cols-4 gap-1.5">
                          {selectedChars.map(c => (
                            <button key={c} onClick={() => setActiveChar(c)} className={`aspect-square flex items-center justify-center rounded-lg border font-mono text-sm md:text-lg transition-all shadow-sm ${activeChar === c ? 'bg-green-500 border-green-400 text-white scale-105 z-10' : 'bg-white border-slate-200 text-slate-400 hover:border-green-200'}`}>
                              {c === ' ' ? <Layers2 className="w-4 h-4 opacity-40" /> : c}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white p-3 md:p-5 rounded-xl border border-slate-100 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 italic"><ZoomIn className="w-3 h-3 text-green-500" /> Zoom</h4>
                          <span className="text-[9px] font-black text-slate-800">{canvasZoom}px</span>
                        </div>
                        <input type="range" min="24" max="84" step="4" value={canvasZoom} onChange={(e) => setCanvasZoom(parseInt(e.target.value))} className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-green-500" />
                      </div>
                      <button onClick={() => resetGrid(gridWidth, gridHeight)} className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                        <Trash2 className="w-3.5 h-3.5" /> Clear
                      </button>
                    </div>
                  </aside>
                  <div className="flex-1 bg-[#f8fafc] relative flex flex-col items-center justify-center p-2 md:p-10 overflow-auto">
                     <div className="bg-white p-3 md:p-8 rounded-[1.5rem] md:rounded-[4rem] shadow-2xl border border-slate-200 relative overflow-visible max-w-full">
                        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px]"></div>
                        <div ref={gridRef} onTouchMove={handleTouchMove} onMouseDown={() => setIsDrawing(true)} onMouseUp={() => setIsDrawing(false)} className="grid bg-white rounded-lg overflow-hidden cursor-crosshair select-none border border-slate-300 touch-none shadow-inner" style={{ gridTemplateColumns: `repeat(${gridWidth}, ${canvasZoom}px)`, width: `${gridWidth * canvasZoom}px`, height: `${gridHeight * canvasZoom}px` }}>
                          {grid.map((row, r) => row.map((char, c) => (
                            <div key={`${r}-${c}`} data-row={r} data-col={c} onMouseDown={() => handleMouseDown(r, c)} onMouseEnter={() => handleMouseEnter(r, c)} className={`border-[0.5px] border-slate-100 flex items-center justify-center font-mono transition-all duration-75 pointer-events-auto ${char !== ' ' ? 'bg-green-500/10 text-green-700 font-bold scale-[0.94] rounded-sm' : 'hover:bg-green-50/50'}`} style={{ width: canvasZoom, height: canvasZoom, fontSize: `${canvasZoom * 0.5}px` }}>{char}</div>
                          )))}
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Validation */}
            {step === 4 && (
              <div className="w-full max-w-4xl animate-fade-in px-4 pt-40 pb-20">
                <StepHeader icon={Printer} title="Validate Logic" desc="Verify your architectural vision." />
                <div className="bg-white border border-slate-100 p-8 md:p-16 rounded-[3.5rem] shadow-xl flex flex-col items-center space-y-12">
                  <div className="bg-slate-50/50 p-6 md:p-16 rounded-[3rem] border border-slate-100 shadow-inner w-full flex justify-center overflow-auto">
                    <div className="bg-white p-8 md:p-20 rounded-2xl shadow-2xl ring-1 ring-slate-100 min-w-max">
                      <div className="font-mono text-slate-900 whitespace-pre leading-[1.1] flex flex-col items-center justify-center" style={{ fontSize: `calc(min(450px, 45vh) / ${Math.max(gridWidth, gridHeight)})`, }}>
                        {grid.map((row, i) => <div key={i} className="flex justify-center w-full">{row.map(char => char === ' ' ? '\u00A0' : char).join('')}</div>)}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                    <button onClick={() => setStep(3)} className="py-5 bg-slate-100 text-slate-600 font-black rounded-2xl uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
                       <ArrowLeft className="w-5 h-5" /> RE-EDIT
                    </button>
                    <button onClick={() => { setStep(5); generateDynamicCode(selectedLang); }} className="py-5 bg-green-500 text-white font-black rounded-2xl uppercase tracking-widest text-sm shadow-lg hover:bg-green-600 transition-all">DECODE <Wand2 className="inline-block ml-2 w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Final Result */}
            {step === 5 && (
              <div className="w-full max-w-7xl animate-fade-in pb-20 px-4 pt-40">
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                  <div className="lg:w-1/2 space-y-10 w-full">
                    <StepHeader icon={CheckCircle2} title="Synthesis Complete" desc="Scaling logic and assets finalized." />
                    <div className="bg-white border border-slate-100 p-10 rounded-[3.5rem] shadow-xl flex flex-col items-center space-y-12">
                      <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner w-full flex justify-center">
                        <img src={currentResultImage} alt="Final Synthesis" className="max-w-full h-auto rounded-xl shadow-xl" />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        <button onClick={() => downloadPng(currentResultImage, `decode_ai_pattern.png`)} className="py-5 bg-green-500 text-white font-black rounded-2xl uppercase tracking-widest text-sm shadow-lg">DOWNLOAD PNG</button>
                        <button onClick={() => setStep(0)} className="py-5 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-widest text-sm">HOME</button>
                      </div>
                      {/* BACK BUTTON IN RESULT STAGE */}
                      <button onClick={() => setStep(4)} className="group flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-green-600 uppercase transition-all">
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Validation
                      </button>
                    </div>
                  </div>
                  <div className="lg:w-1/2 space-y-8 w-full">
                    <div className="bg-white border border-slate-100 rounded-[3.5rem] p-10 shadow-xl flex flex-col min-h-[700px]">
                      <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                          <Terminal className="w-7 h-7 text-green-500" />
                          <h3 className="font-black text-slate-900 text-2xl tracking-tight">Derived Logic</h3>
                        </div>
                        <select value={selectedLang} onChange={(e) => { setSelectedLang(e.target.value); generateDynamicCode(e.target.value); }} className="bg-slate-50 border border-slate-200 px-6 py-3 rounded-xl font-bold outline-none">
                          {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>
                      </div>
                      <div className="mb-8"><p className="text-slate-500 text-lg italic opacity-80 border-l-4 border-green-500 pl-6 leading-relaxed">"{generatedLogic?.explanation || "Neural synthesis in progress..."}"</p></div>
                      <div className="flex-1 min-h-0 h-[400px] mb-8 relative">
                        {isProcessing && <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center rounded-3xl backdrop-blur-sm"><RefreshCw className="w-12 h-12 text-green-500 animate-spin mb-4" /><span className="text-xs font-black text-green-600 uppercase tracking-widest animate-pulse">Decoding...</span></div>}
                        <div className="h-full rounded-3xl overflow-hidden border border-slate-100">
                          <MatrixPreview grid={grid} customCode={generatedLogic?.code} language={selectedLang} />
                        </div>
                      </div>
                      <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
                         <h4 className="text-[11px] font-black text-green-600 uppercase tracking-widest mb-4">Neural Simulation (n=5)</h4>
                         <div className="bg-black p-4 rounded-xl">
                           <pre className="font-mono text-xs md:text-sm text-green-500 leading-none overflow-auto whitespace-pre">{generatedLogic?.simulatedScale || "Calculating matrix..."}</pre>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
