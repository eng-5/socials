import { useState, useRef, useEffect } from 'react';
import { Search, Video, Phone, Info, Send, Plus, Smile, Paperclip, X } from 'lucide-react';

const conversations = [
  { id: 1, name: 'Aelia Vance',     handle: 'Just now', img: 14, preview: 'The obsidian rendering looks incredible!', unread: 2, online: true,  active: true  },
  { id: 2, name: 'Julian K.',       handle: '12m',      img: 12, preview: 'Sent a photo',                            unread: 0, online: false, active: false },
  { id: 3, name: 'Sarah Moss',      handle: '1h',       img: 45, preview: 'Check the API docs for updates.',         unread: 0, online: true,  active: false },
  { id: 4, name: 'Obsidian AI',     handle: 'System',   img: 60, preview: 'Neural engine optimized.',                unread: 1, online: true,  active: false, isAI: true },
  { id: 5, name: 'Marcus Thorne',   handle: '3h',       img: 12, preview: 'Great work on the component!',            unread: 0, online: false, active: false },
];

const messages = [
  { id: 1, sent: false, text: 'Did you see the latest concept for the Obsidian UI? The tonal layering is revolutionary.', time: '10:42 AM' },
  { id: 2, sent: true,  text: 'Just checked it out! The "no-border" rule is bold but the depth is much cleaner.', time: '10:44 AM' },
  { id: 3, sent: false, text: 'Exactly. It feels more physical than flat. Let\'s talk about the AI input field next.', time: '10:45 AM' },
  { id: 4, sent: true,  text: 'The obsidian rendering looks incredible! Check this wave I generated.', time: '10:47 AM', image: 'https://picsum.photos/seed/obswave/400/240' },
];

export default function Messages() {
  const [activeId, setActiveId]   = useState(1);
  const [input, setInput]         = useState('');
  const [search, setSearch]       = useState('');
  const [allMessages, setAllMsgs] = useState(messages);
  const messagesEndRef            = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const active = conversations.find(c => c.id === activeId);

  const handleSend = () => {
    if (!input.trim()) return;
    setAllMsgs(p => [...p, { id: Date.now(), sent: true, text: input, time: 'Now' }]);
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-background">

      {/* ── Left: Conversation List ── */}
      <section className="w-80 flex-shrink-0 flex flex-col bg-surface-container-low/40 border-r border-outline-variant/10 hidden md:flex">
        <div className="p-5 border-b border-outline-variant/8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold font-headline">Messages</h1>
            <button className="p-2 rounded-xl bg-surface-container-highest text-primary hover:bg-surface-bright transition-colors">
              <Plus size={16} />
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full bg-surface-container-highest/50 rounded-xl py-2 pl-9 pr-4 text-sm border-none outline-none placeholder:text-on-surface-variant/60"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {conversations.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              className={`w-full flex items-center gap-3 p-4 text-left transition-all ${
                conv.id === activeId
                  ? 'bg-primary/8 border-l-[3px] border-primary'
                  : 'hover:bg-surface-container border-l-[3px] border-transparent'
              }`}
            >
              <div className="relative flex-shrink-0">
                {conv.isAI ? (
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center">
                    <span className="text-on-primary text-xs font-bold">AI</span>
                  </div>
                ) : (
                  <img src={`https://i.pravatar.cc/150?img=${conv.img}`} alt={conv.name} className="w-11 h-11 rounded-full object-cover" />
                )}
                {conv.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-surface-container-low" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className={`text-sm font-semibold truncate ${conv.id === activeId ? 'text-on-surface' : ''}`}>{conv.name}</span>
                  <span className={`text-[10px] ml-1 flex-shrink-0 ${conv.id === activeId ? 'text-primary font-semibold' : 'text-on-surface-variant/60'}`}>{conv.handle}</span>
                </div>
                <p className="text-xs text-on-surface-variant truncate mt-0.5">{conv.preview}</p>
              </div>
              {conv.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">{conv.unread}</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ── Right: Active Conversation ── */}
      <section className="flex-1 flex flex-col bg-surface">
        {/* Conversation Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-surface-container/30 backdrop-blur-md border-b border-outline-variant/8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={`https://i.pravatar.cc/150?img=${active?.img}`} alt={active?.name} className="w-9 h-9 rounded-full object-cover" />
              {active?.online && (
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-surface-container rounded-full" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-sm">{active?.name}</h3>
              <p className="text-[10px] text-emerald-400 font-medium uppercase tracking-wider">
                {active?.online ? 'Online Now' : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            {[Video, Phone, Info].map((Icon, i) => (
              <button key={i} className="p-2 rounded-full hover:bg-surface-bright transition-colors text-on-surface-variant hover:text-on-surface">
                <Icon size={18} />
              </button>
            ))}
          </div>
        </header>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar">
          <div className="flex justify-center">
            <span className="px-4 py-1 rounded-full bg-surface-container text-[10px] text-on-surface-variant/70 font-bold uppercase tracking-widest">Today</span>
          </div>

          {allMessages.map(msg => (
            <div key={msg.id} className={`flex items-end gap-2.5 max-w-[78%] ${msg.sent ? 'ml-auto flex-row-reverse' : ''}`}>
              {!msg.sent && (
                <img src={`https://i.pravatar.cc/150?img=${active?.img}`} alt="" className="w-6 h-6 rounded-full flex-shrink-0 mb-1" />
              )}
              <div className="flex flex-col gap-2">
                {msg.image && (
                  <div className="rounded-2xl overflow-hidden border border-outline-variant/20 shadow-xl max-w-xs">
                    <img src={msg.image} alt="Attachment" className="w-full object-cover" />
                  </div>
                )}
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-lg ${
                  msg.sent
                    ? 'bg-gradient-to-br from-primary-dim to-primary text-on-primary rounded-br-none shadow-primary/20'
                    : 'glass-panel border border-outline-variant/10 text-on-surface rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
              <span className={`text-[10px] text-on-surface-variant/50 mb-1 flex-shrink-0`}>{msg.time}</span>
            </div>
          ))}

          {/* Typing Indicator */}
          <div className="flex items-end gap-2.5 max-w-[78%]">
            <img src={`https://i.pravatar.cc/150?img=${active?.img}`} alt="" className="w-6 h-6 rounded-full" />
            <div className="glass-panel border border-outline-variant/10 px-4 py-3 rounded-2xl rounded-bl-none flex gap-1 items-center">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce-dot" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <footer className="p-4 bg-surface-container-low/80 backdrop-blur-xl border-t border-outline-variant/8 flex-shrink-0">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <button className="p-2.5 rounded-xl bg-surface-container-highest text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all flex-shrink-0">
              <Plus size={18} />
            </button>
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Write a message..."
                className="w-full bg-surface-container px-5 py-3 rounded-2xl border-none outline-none text-sm placeholder:text-on-surface-variant/50 pr-20"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                <button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"><Smile size={16} /></button>
                <button className="p-1.5 text-on-surface-variant hover:text-primary transition-colors"><Paperclip size={15} /></button>
              </div>
            </div>
            <button
              onClick={handleSend}
              className="p-3.5 rounded-2xl bg-gradient-to-br from-primary to-primary-dim text-on-primary shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex-shrink-0"
            >
              <Send size={17} />
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
