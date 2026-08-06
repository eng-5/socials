import { useState } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Compass, Bell, MessageCircle, Map, User, Bot,
  Settings, Search, Plus, Sparkles, TrendingUp, Zap, Activity
} from 'lucide-react';

const navItems = [
  { to: '/', icon: Home,          label: 'Home',          end: true },
  { to: '/explore',       icon: Compass,       label: 'Explore' },
  { to: '/notifications', icon: Bell,          label: 'Notifications' },
  { to: '/messages',      icon: MessageCircle, label: 'Messages' },
  { to: '/map',           icon: Map,           label: 'Map' },
  { to: '/profile',       icon: User,          label: 'Profile' },
  { to: '/ai',            icon: Bot,           label: 'AI Assistant' },
];

const mobileNav = [
  { to: '/', icon: Home, end: true },
  { to: '/explore',       icon: Compass },
  { to: '/messages',      icon: MessageCircle },
  { to: '/notifications', icon: Bell },
  { to: '/profile',       icon: User },
];

const aiTrending = [
  { cat: 'AI Pulse · Trending', tag: '#NeuralArtGen', score: 98 },
  { cat: 'Design · Hot',        tag: '#CinematicUI',  score: 91 },
  { cat: 'Tech · Rising',       tag: '#ObsidianVibe', score: 87 },
];

export default function MainLayout() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [sfocus, setSfocus] = useState(false);

  const isHome     = location.pathname === '/';
  const isMessages = location.pathname === '/messages';

  return (
    <div className="min-h-screen bg-background text-on-surface font-body">

      {/* ── Cinematic Background Glows ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[55%] h-[55%] bg-secondary-container/20 rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-primary-dim/10 rounded-full blur-[140px] animate-pulse-glow delay-1500" />
      </div>

      {/* ── Top Bar ── */}
      <header className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-4 lg:px-8 bg-slate-950/60 backdrop-blur-xl border-b border-slate-800/20 shadow-[0_4px_30px_rgba(0,0,0,0.3)]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center shadow-lg shadow-primary/30 flex-shrink-0">
            <Sparkles size={13} className="text-on-primary" />
          </div>
          <span className="text-lg font-black font-headline tracking-tight hidden sm:block bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
            Obsidian AI
          </span>
        </div>

        <div className={`hidden md:flex items-center gap-2 bg-surface-container-highest/40 border rounded-full px-4 py-2 transition-all duration-300 w-56 lg:w-72 ${sfocus ? 'border-primary/40 shadow-[0_0_20px_rgba(167,165,255,0.1)]' : 'border-outline-variant/15'}`}>
          <Search size={13} className={sfocus ? 'text-primary' : 'text-outline'} />
          <input
            type="text"
            placeholder="Search obsidian..."
            onFocus={() => setSfocus(true)}
            onBlur={() => setSfocus(false)}
            className="bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-outline/60 w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-primary/8 transition-all">
            <Bell size={19} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border-2 border-background" />
          </button>
          <button onClick={() => navigate('/profile')} className="w-8 h-8 rounded-full overflow-hidden border border-primary/30 hover:border-primary/60 ring-2 ring-transparent hover:ring-primary/20 transition-all">
            <img src="https://i.pravatar.cc/150?img=11" alt="Profile" className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      {/* ── Left Sidebar (lg+) ── */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col pt-20 pb-6 bg-slate-950/80 backdrop-blur-2xl border-r border-slate-800/25 z-40 overflow-y-auto no-scrollbar">
        <div className="px-6 mb-5">
          <h2 className="text-sm font-black font-headline text-on-surface">Obsidian</h2>
          <p className="text-[10px] text-on-surface-variant/60 uppercase tracking-[0.2em] mt-0.5">AI-Powered Social</p>
        </div>

        <nav className="flex flex-col gap-0.5 px-3 flex-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
                  isActive
                    ? 'text-primary bg-primary/10 font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 hover:translate-x-1'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />}
                  <Icon size={17} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mt-2 ${
                isActive ? 'text-primary bg-primary/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`
            }
          >
            <Settings size={17} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="px-4 mt-4">
          <button className="w-full py-2.5 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold rounded-xl shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all text-sm flex items-center justify-center gap-2">
            <Plus size={14} /> New Post
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <div className={`relative z-10 ${isMessages ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
        <div className={`lg:ml-64 pt-16 ${!isMessages ? 'pb-20 lg:pb-0' : ''} ${isHome ? 'xl:mr-80' : ''} ${isMessages ? 'h-full' : ''}`}>
          <Outlet />
        </div>

        {/* Right AI sidebar — home + xl */}
        {isHome && (
          <aside className="hidden xl:block fixed right-0 top-16 bottom-0 w-80 p-5 pt-8 pb-24 space-y-5 bg-surface-container-low/20 backdrop-blur-sm border-l border-outline-variant/10 overflow-y-auto custom-scrollbar z-30">
            <div className="bg-surface-container rounded-3xl p-5 border border-outline-variant/10 flex-shrink-0">
              <h3 className="font-headline font-bold text-sm mb-4 flex items-center gap-2">
                <Sparkles size={14} className="text-primary" /> AI Trending
              </h3>
              {aiTrending.map(({ cat, tag, score }) => (
                <div key={tag} className="mb-4 cursor-pointer group">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mb-0.5">{cat}</p>
                  <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{tag}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-0.5 bg-outline-variant/20 rounded-full">
                      <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${score}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-tertiary">{score}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-indigo-900/50 to-violet-900/50 rounded-3xl p-5 border border-indigo-500/20 relative overflow-hidden group flex-shrink-0">
              <div className="absolute -top-4 -right-4 p-4 opacity-10 scale-100 group-hover:scale-110 transition-transform duration-500 pointer-events-none">
                <Activity size={80} />
              </div>
              <div className="relative z-10 flex flex-col items-start">
                <Zap size={18} className="text-primary mb-3" />
                <h3 className="text-sm font-bold mb-1.5 text-white">Premium Insights</h3>
                <p className="text-xs text-indigo-100/70 mb-5 leading-relaxed">Real-time AI sentiment on any topic in your feed.</p>
                <button className="px-5 py-2.5 bg-white text-indigo-950 text-xs font-black tracking-wide rounded-xl hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all shadow-[0_4px_20px_rgba(255,255,255,0.15)] flex-shrink-0">
                  Upgrade Now
                </button>
              </div>
            </div>

            <div className="bg-surface-container rounded-3xl p-5 border border-outline-variant/10 relative overflow-hidden group flex-shrink-0">
              <h3 className="font-headline font-bold text-sm mb-5 flex items-center gap-2"><User size={14} className="text-secondary" /> Who to Follow</h3>
              <div className="space-y-4">
                {[{ name: 'Elena Vance', handle: '@evance', img: 5 }, { name: 'Marcus Thorne', handle: '@mthorne', img: 12 }, { name: 'Aelia Rivera', handle: '@arivera', img: 9 }].map(({ name, handle, img }) => (
                  <div key={handle} className="flex items-center gap-3 group/person cursor-pointer">
                    <img src={`https://i.pravatar.cc/150?img=${img}`} alt="" className="w-10 h-10 rounded-full border-2 border-outline-variant/10 group-hover/person:border-primary/40 transition-colors" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-on-surface truncate group-hover/person:text-primary transition-colors">{name}</p>
                      <p className="text-[11px] text-on-surface-variant truncate">{handle}</p>
                    </div>
                    <button className="text-[11px] font-bold text-primary border border-primary/20 px-3.5 py-1.5 rounded-full hover:bg-primary hover:text-on-primary hover:border-primary transition-all">Follow</button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-16 bg-slate-950/85 backdrop-blur-2xl border-t border-slate-800/30 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
        {mobileNav.map(({ to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all ${
                isActive ? 'text-primary bg-primary/10 scale-105' : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            <Icon size={21} />
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
