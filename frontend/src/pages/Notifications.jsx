import { useState } from 'react';
import { Sparkles, Heart, MessageSquare, UserPlus, Bell, RefreshCw } from 'lucide-react';

const tabs = ['All', 'Mentions', 'Likes', 'System'];

const notifications = [
  {
    id: 1, type: 'like', tab: 'Likes', isNew: true,
    name: 'Julian Vane', img: 12,
    text: 'liked your post',
    excerpt: '"Neural architectures of the future..."',
    time: '2 minutes ago',
    accent: 'tertiary', icon: Heart,
  },
  {
    id: 2, type: 'mention', tab: 'Mentions', isNew: false,
    name: 'Elena Rossi', img: 5,
    text: 'mentioned you in a comment',
    quote: '"I think @you handles the obsidian layers perfectly here. What was the prompt sequence?"',
    time: '45 minutes ago',
    accent: 'primary', icon: MessageSquare,
  },
  {
    id: 3, type: 'follow', tab: 'All', isNew: false,
    name: 'Marcus Thorne', img: 12,
    text: 'started following you',
    time: '2 hours ago',
    accent: 'secondary', icon: UserPlus, cta: 'Follow Back',
  },
  {
    id: 4, type: 'system', tab: 'System', isNew: false,
    name: 'System Update', img: null,
    text: 'AI Model v4.2 is now active in your workspace.',
    time: '5 hours ago',
    accent: 'primary', icon: Sparkles,
  },
  {
    id: 5, type: 'repost', tab: 'All', isNew: false,
    name: 'Sarah Jenkins', img: 45,
    text: 'reposted your thread',
    excerpt: '"Design Systems in 2025"',
    time: 'Yesterday',
    accent: 'primary', icon: RefreshCw,
  },
  {
    id: 6, type: 'like', tab: 'Likes', isNew: false,
    name: 'David Chen', img: 13,
    text: 'commented on your photo',
    quote: '"The lighting in this obsidian render is unparalleled!"',
    time: 'Yesterday',
    accent: 'secondary', icon: MessageSquare,
  },
];

const accentMap = {
  primary:   'bg-primary/15 text-primary border-primary',
  secondary: 'bg-secondary/15 text-secondary border-secondary',
  tertiary:  'bg-tertiary/15 text-tertiary border-tertiary',
};

export default function Notifications() {
  const [activeTab, setActiveTab] = useState('All');
  const [followed, setFollowed]   = useState({});

  const filtered = activeTab === 'All'
    ? notifications
    : notifications.filter(n => n.tab === activeTab);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 lg:pb-10">

      {/* Header */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-extrabold font-headline tracking-tight">Notifications</h1>
            <p className="text-on-surface-variant text-sm mt-1">Stay updated with your obsidian network.</p>
          </div>
          <button className="text-sm font-semibold text-primary hover:text-primary-fixed transition-colors">
            Mark all read
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-6 overflow-x-auto no-scrollbar pb-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold flex-shrink-0 transition-all active:scale-95 ${
                activeTab === tab
                  ? 'bg-primary/15 text-primary border border-primary/30'
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map((notif, i) => {
          const Icon = notif.icon;
          const accent = accentMap[notif.accent];
          return (
            <div
              key={notif.id}
              className={`animate-fade-up glass-panel rounded-2xl flex items-start gap-4 p-5 border transition-all hover:border-outline-variant/25 relative overflow-hidden ${
                notif.isNew ? 'border-primary/20 shadow-[0_0_20px_rgba(167,165,255,0.06)]' : 'border-outline-variant/10'
              }`}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {/* New indicator */}
              {notif.isNew && (
                <div className="absolute left-0 top-4 bottom-4 w-[3px] bg-primary rounded-full" />
              )}

              {/* Avatar / Icon */}
              <div className="relative flex-shrink-0">
                {notif.img ? (
                  <img src={`https://i.pravatar.cc/150?img=${notif.img}`} alt={notif.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${accent}`}>
                    <Icon size={20} />
                  </div>
                )}
                {notif.img && (
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-surface-container shadow-lg ${accent}`}>
                    <Icon size={12} />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <p className="text-on-surface text-sm leading-snug">
                    <span className="font-bold">{notif.name}</span>{' '}
                    <span className="text-on-surface-variant">{notif.text}</span>
                    {notif.excerpt && <span className="text-on-surface-variant/80 italic"> {notif.excerpt}</span>}
                  </p>
                  {notif.isNew && (
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex-shrink-0">New</span>
                  )}
                </div>

                {/* Quoted content */}
                {notif.quote && (
                  <div className="mt-2.5 p-3 bg-surface-container-highest/40 rounded-xl border-l-2 border-primary/30 text-xs text-on-surface-variant italic leading-relaxed">
                    {notif.quote}
                  </div>
                )}

                <div className="flex items-center justify-between mt-2">
                  <p className="text-[11px] text-on-surface-variant">{notif.time}</p>
                  {notif.cta && (
                    <button
                      onClick={() => setFollowed(p => ({ ...p, [notif.name]: !p[notif.name] }))}
                      className={`px-4 py-1.5 rounded-full text-[11px] font-bold border transition-all active:scale-95 ${
                        followed[notif.name]
                          ? 'bg-primary/15 border-primary/40 text-primary'
                          : 'border-primary/40 text-primary hover:bg-primary/10'
                      }`}
                    >
                      {followed[notif.name] ? 'Following ✓' : notif.cta}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating AI Button */}
      <div className="fixed bottom-24 lg:bottom-8 right-6 lg:right-8 z-50">
        <button className="flex items-center gap-3 glass-panel border border-primary/25 pl-3 pr-5 py-2.5 rounded-full shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dim flex items-center justify-center text-on-primary shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
            <Sparkles size={15} />
          </div>
          <span className="text-sm font-bold text-on-surface">Summarize Activity</span>
        </button>
      </div>
    </div>
  );
}
