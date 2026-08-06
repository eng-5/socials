import { useState } from 'react';
import { Bot, Sparkles, Send, RefreshCw, Zap, Brain, Code2, ImageIcon, ChevronRight } from 'lucide-react';

const HISTORY = [
  { id: 1, title: 'Obsidian rendering tips',   time: 'Today' },
  { id: 2, title: 'UI animation principles',    time: 'Today' },
  { id: 3, title: 'Gen-AI prompt engineering',  time: 'Yesterday' },
  { id: 4, title: 'Glassmorphism best practices',time: 'Mon' },
];

const SUGGESTIONS = [
  { icon: Brain,    label: 'Summarize my feed activity' },
  { icon: Code2,    label: 'Generate an AI post caption' },
  { icon: ImageIcon,label: 'Create an obsidian art concept' },
  { icon: Zap,      label: 'Trending topic analysis' },
];

const INITIAL = [
  { role: 'ai',  text: 'Hey 👋 I\'m your Obsidian AI assistant. I can summarize your feed, generate content, analyze trends, or just chat. What\'s on your mind?' },
];

export default function AIAssistant() {
  const [messages, setMessages] = useState(INITIAL);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [activeHistory, setActiveHistory] = useState(1);

  const RESPONSES = [
    'Analyzing the obsidian network... Based on your recent activity, topics in **Neural Architecture** and **Cinematic UI** are trending in your circle.',
    'Here\'s a generated caption for your next post:\n\n*"The void between pixels is where obsidian lives. Every shadow is a feature, not a bug."*\n\nWant me to generate variations?',
    'I\'ve identified 3 key engagement patterns in your last 7 days. Your posts with visual content receive 2.4× more interaction than text-only posts.',
    'Great question! I can break this into three perspectives: technical, design, and user experience. Want me to explore all three?',
  ];

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;
    setInput('');
    setMessages(p => [...p, { role: 'user', text: msg }]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 600));
    setMessages(p => [...p, { role: 'ai', text: RESPONSES[Math.floor(Math.random() * RESPONSES.length)] }]);
    setLoading(false);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">

      {/* ── Left: History Panel ── */}
      <aside className="hidden lg:flex w-72 flex-col bg-surface-container-low/40 border-r border-outline-variant/10 flex-shrink-0">
        <div className="p-5 border-b border-outline-variant/8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center shadow-lg shadow-primary/30">
              <Bot size={17} className="text-on-primary" />
            </div>
            <div>
              <h2 className="font-bold font-headline text-sm text-on-surface">Obsidian AI</h2>
              <p className="text-[10px] text-emerald-400 font-semibold">Online · v4.2</p>
            </div>
          </div>
          <button
            onClick={() => { setMessages(INITIAL); setActiveHistory(null); }}
            className="w-full flex items-center justify-center gap-2 py-2 bg-primary/10 border border-primary/20 rounded-xl text-primary text-xs font-bold hover:bg-primary/20 transition-all"
          >
            <RefreshCw size={12} /> New conversation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-3">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest px-2 mb-3">Recent</p>
          {HISTORY.map(h => (
            <button
              key={h.id}
              onClick={() => setActiveHistory(h.id)}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all mb-1 ${
                activeHistory === h.id
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <div className="truncate">{h.title}</div>
              <div className="text-[10px] opacity-60 mt-0.5">{h.time}</div>
            </button>
          ))}
        </div>
      </aside>

      {/* ── Main Chat ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-6 border-b border-outline-variant/10 bg-surface-container-low/30 backdrop-blur-md flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center">
              <Bot size={14} className="text-on-primary" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-on-surface">Obsidian AI Assistant</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-medium">Neural engine active</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
              Pro · v4.2
            </span>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 animate-fade-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'ai' ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/20 mt-1">
                  <Sparkles size={13} className="text-on-primary" />
                </div>
              ) : (
                <img src="https://i.pravatar.cc/150?img=11" alt="You" className="w-8 h-8 rounded-full flex-shrink-0 mt-1" />
              )}
              <div className={`max-w-[78%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-5 py-4 rounded-3xl text-sm leading-relaxed shadow-lg ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-br from-primary-dim to-primary text-on-primary rounded-tr-none shadow-primary/20'
                    : 'glass-panel border border-outline-variant/10 text-on-surface rounded-tl-none'
                }`}>
                  {msg.text.split('\n').map((line, j) => (
                    <p key={j} className={j > 0 ? 'mt-2' : ''}>
                      {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                    </p>
                  ))}
                </div>
                <span className="text-[10px] text-on-surface-variant/50 px-1">
                  {msg.role === 'ai' ? 'Obsidian AI' : 'You'}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 animate-fade-up">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center flex-shrink-0 shadow-md shadow-primary/20">
                <Sparkles size={13} className="text-on-primary" />
              </div>
              <div className="glass-panel border border-outline-variant/10 px-5 py-4 rounded-3xl rounded-tl-none flex items-center gap-2">
                {[0,1,2].map(i => (
                  <div key={i} className="w-2 h-2 bg-primary/60 rounded-full animate-bounce-dot" style={{ animationDelay: `${i*0.15}s` }} />
                ))}
              </div>
            </div>
          )}

          {/* Suggestions (only when just intro visible) */}
          {messages.length <= 1 && !loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {SUGGESTIONS.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  onClick={() => sendMessage(label)}
                  className="flex items-center gap-3 p-4 glass-panel border border-outline-variant/10 rounded-2xl text-sm text-on-surface-variant hover:text-on-surface hover:border-primary/25 hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon size={15} />
                  </div>
                  <span className="font-medium text-xs leading-snug">{label}</span>
                  <ChevronRight size={13} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-outline-variant/8 bg-surface-container-low/50 backdrop-blur-xl flex-shrink-0">
          <div className="relative max-w-3xl mx-auto">
            <div className="flex items-end gap-3 glass-card border border-outline-variant/15 rounded-3xl px-5 py-4 focus-within:border-primary/30 focus-within:shadow-[0_0_20px_rgba(167,165,255,0.08)] transition-all">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask Obsidian AI anything... (⏎ to send)"
                rows={1}
                className="flex-1 bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-on-surface-variant/50 resize-none leading-relaxed"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dim text-on-primary flex items-center justify-center shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={15} />
              </button>
            </div>
            <p className="text-center text-[10px] text-on-surface-variant/40 mt-2.5">
              Obsidian AI · Powered by Neural Engine v4.2 · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
