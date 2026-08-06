import { useState } from 'react';
import {
  User, Bell, Lock, Shield, Palette, Bot, Moon, Sun,
  ChevronRight, LogOut, Trash2, Download, Globe, Eye, EyeOff,
  ToggleLeft, ToggleRight, AlertTriangle
} from 'lucide-react';

const SECTIONS = [
  { id: 'profile',       label: 'Profile',        icon: User },
  { id: 'appearance',    label: 'Appearance',      icon: Palette },
  { id: 'notifications', label: 'Notifications',   icon: Bell },
  { id: 'privacy',       label: 'Privacy',         icon: Shield },
  { id: 'ai',            label: 'AI Preferences',  icon: Bot },
  { id: 'security',      label: 'Security',        icon: Lock },
];

function Toggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-11 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${enabled ? 'bg-primary' : 'bg-surface-container-highest border border-outline-variant/30'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${enabled ? 'left-[calc(100%-1.375rem)]' : 'left-0.5'}`} />
    </button>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-outline-variant/8 last:border-0 gap-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-on-surface">{label}</p>
        {description && <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export default function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [toggles, setToggles] = useState({
    darkMode: true, reducedMotion: false, compactView: false,
    notifLikes: true, notifComments: true, notifFollows: true, notifSystem: false, notifEmail: false,
    privateAccount: false, showOnline: true, indexable: true, dataSharing: false,
    aiSummary: true, aiSuggestions: true, aiFilter: true, aiVoice: false,
    twoFactor: false, loginAlerts: true,
  });
  const [form, setForm] = useState({ name: 'Kaelen Vance', handle: 'kaelen_obsidian', bio: 'Digital architect & AI enthusiast. Building the next generation of social interaction at Obsidian Lab.', email: 'kaelen@obsidian.ai' });

  const toggle = (key) => setToggles(p => ({ ...p, [key]: !p[key] }));

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return (
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6 p-6 bg-surface-container rounded-2xl border border-outline-variant/10">
            <div className="relative group">
              <img src="https://i.pravatar.cc/150?img=11" alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border-2 border-primary/30" />
              <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <span className="text-white text-xs font-bold">Change</span>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-on-surface">{form.name}</h3>
              <p className="text-sm text-on-surface-variant">@{form.handle}</p>
              <button className="mt-2 text-xs font-bold text-primary hover:text-primary-fixed transition-colors">Upload new photo →</button>
            </div>
          </div>
          {/* Fields */}
          {[
            { key: 'name',   label: 'Display name',  type: 'text' },
            { key: 'handle', label: 'Username',       type: 'text', prefix: '@' },
            { key: 'email',  label: 'Email address',  type: 'email' },
          ].map(({ key, label, type, prefix }) => (
            <div key={key} className="space-y-1.5">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">{label}</label>
              <div className="relative">
                {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-semibold">{prefix}</span>}
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                  className={`w-full py-3.5 bg-surface-container border border-outline-variant/20 rounded-xl text-on-surface text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all ${prefix ? 'pl-8 pr-4' : 'px-4'}`}
                />
              </div>
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest">Bio</label>
            <textarea
              value={form.bio}
              onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
              rows={3}
              maxLength={200}
              className="w-full px-4 py-3.5 bg-surface-container border border-outline-variant/20 rounded-xl text-on-surface text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
            />
            <p className="text-[10px] text-on-surface-variant text-right">{form.bio.length}/200</p>
          </div>
          <button className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold rounded-xl shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all text-sm">
            Save changes
          </button>
        </div>
      );

      case 'appearance': return (
        <div className="space-y-2">
          <SettingRow label="Dark mode" description="Use the dark obsidian theme across all surfaces">
            <Toggle enabled={toggles.darkMode} onToggle={() => toggle('darkMode')} />
          </SettingRow>
          <SettingRow label="Reduce motion" description="Minimize animations for accessibility">
            <Toggle enabled={toggles.reducedMotion} onToggle={() => toggle('reducedMotion')} />
          </SettingRow>
          <SettingRow label="Compact view" description="Show more content with tighter spacing">
            <Toggle enabled={toggles.compactView} onToggle={() => toggle('compactView')} />
          </SettingRow>
          <div className="mt-6 p-5 bg-surface-container rounded-2xl border border-outline-variant/10">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4">Accent Color</p>
            <div className="flex gap-3">
              {[
                { color: 'bg-indigo-500', ring: 'ring-indigo-500', label: 'Indigo' },
                { color: 'bg-violet-500', ring: 'ring-violet-500', label: 'Violet' },
                { color: 'bg-pink-500',   ring: 'ring-pink-500',   label: 'Pink' },
                { color: 'bg-cyan-500',   ring: 'ring-cyan-500',   label: 'Cyan' },
                { color: 'bg-emerald-500',ring: 'ring-emerald-500',label: 'Emerald'},
              ].map(({ color, ring, label }, i) => (
                <button key={label} title={label} className={`w-8 h-8 ${color} rounded-full transition-all hover:scale-110 ${i === 0 ? `ring-2 ring-offset-2 ring-offset-surface-container ${ring}` : ''}`} />
              ))}
            </div>
          </div>
        </div>
      );

      case 'notifications': return (
        <div className="space-y-2">
          {[
            { key: 'notifLikes',    label: 'Likes',           desc: 'When someone likes your post' },
            { key: 'notifComments', label: 'Comments',         desc: 'When someone comments on your content' },
            { key: 'notifFollows',  label: 'New followers',    desc: 'When someone starts following you' },
            { key: 'notifSystem',   label: 'System updates',   desc: 'Platform news and feature announcements' },
            { key: 'notifEmail',    label: 'Email digest',      desc: 'Weekly summary sent to your email' },
          ].map(({ key, label, desc }) => (
            <SettingRow key={key} label={label} description={desc}>
              <Toggle enabled={toggles[key]} onToggle={() => toggle(key)} />
            </SettingRow>
          ))}
        </div>
      );

      case 'privacy': return (
        <div className="space-y-2">
          {[
            { key: 'privateAccount', label: 'Private account',    desc: 'Only approved followers see your posts' },
            { key: 'showOnline',     label: 'Show online status', desc: 'Let others see when you\'re active' },
            { key: 'indexable',      label: 'Discoverable',        desc: 'Appear in search results and recommendations' },
            { key: 'dataSharing',    label: 'Analytics sharing',   desc: 'Help improve Obsidian by sharing usage data' },
          ].map(({ key, label, desc }) => (
            <SettingRow key={key} label={label} description={desc}>
              <Toggle enabled={toggles[key]} onToggle={() => toggle(key)} />
            </SettingRow>
          ))}
          <div className="mt-6 space-y-3">
            <button className="w-full flex items-center justify-between px-5 py-3.5 bg-surface-container rounded-2xl border border-outline-variant/10 hover:border-outline-variant/25 transition-all group text-sm font-semibold">
              <div className="flex items-center gap-3"><Download size={15} className="text-on-surface-variant" /> Download your data</div>
              <ChevronRight size={14} className="text-on-surface-variant group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between px-5 py-3.5 bg-error-container/15 rounded-2xl border border-error/15 hover:border-error/30 transition-all group text-sm font-semibold text-error">
              <div className="flex items-center gap-3"><Trash2 size={15} /> Delete account</div>
              <AlertTriangle size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      );

      case 'ai': return (
        <div className="space-y-2">
          {[
            { key: 'aiSummary',     label: 'AI post summaries',     desc: 'Smart summaries appear on long posts in your feed' },
            { key: 'aiSuggestions', label: 'Smart suggestions',      desc: 'AI-curated content recommendations' },
            { key: 'aiFilter',      label: 'Content filtering',       desc: 'AI-powered safety and quality filters' },
            { key: 'aiVoice',       label: 'Voice input (beta)',      desc: 'Dictate posts and messages using your microphone' },
          ].map(({ key, label, desc }) => (
            <SettingRow key={key} label={label} description={desc}>
              <Toggle enabled={toggles[key]} onToggle={() => toggle(key)} />
            </SettingRow>
          ))}
          <div className="mt-4 p-5 bg-gradient-to-br from-indigo-900/30 to-violet-900/30 rounded-2xl border border-indigo-500/20">
            <div className="flex items-start gap-3">
              <Bot size={18} className="text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-on-surface">Neural Engine v4.2</p>
                <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">Your AI model is up-to-date. Processing 40% faster with the latest architecture update.</p>
              </div>
            </div>
          </div>
        </div>
      );

      case 'security': return (
        <div className="space-y-2">
          {[
            { key: 'twoFactor',    label: 'Two-factor authentication', desc: 'Add an extra layer of security to your account' },
            { key: 'loginAlerts',  label: 'Login alerts',               desc: 'Get notified of new sign-ins to your account' },
          ].map(({ key, label, desc }) => (
            <SettingRow key={key} label={label} description={desc}>
              <Toggle enabled={toggles[key]} onToggle={() => toggle(key)} />
            </SettingRow>
          ))}
          <div className="mt-6 space-y-3">
            <button className="w-full flex items-center justify-between px-5 py-3.5 bg-surface-container rounded-2xl border border-outline-variant/10 hover:border-outline-variant/25 transition-all group text-sm font-semibold">
              <div className="flex items-center gap-3"><Lock size={15} className="text-on-surface-variant" /> Change password</div>
              <ChevronRight size={14} className="text-on-surface-variant group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between px-5 py-3.5 bg-surface-container rounded-2xl border border-outline-variant/10 hover:border-outline-variant/25 transition-all group text-sm font-semibold">
              <div className="flex items-center gap-3"><Globe size={15} className="text-on-surface-variant" /> Active sessions</div>
              <ChevronRight size={14} className="text-on-surface-variant group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button className="w-full flex items-center justify-between px-5 py-3.5 bg-error-container/15 rounded-2xl border border-error/15 hover:border-error/30 transition-all group text-sm font-semibold text-error">
              <div className="flex items-center gap-3"><LogOut size={15} /> Sign out of all devices</div>
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      );

      default: return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 pb-24 lg:pb-10">
      <div className="mb-8 animate-fade-up">
        <h1 className="text-3xl font-extrabold font-headline tracking-tight">Settings</h1>
        <p className="text-on-surface-variant text-sm mt-1">Manage your account, privacy, and preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 animate-fade-up delay-100">
        {/* Section Nav */}
        <aside className="lg:w-56 flex-shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto no-scrollbar lg:overflow-visible">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeSection === id
                    ? 'bg-primary/10 text-primary font-bold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <Icon size={15} />
                <span>{label}</span>
              </button>
            ))}
            <hr className="border-outline-variant/10 hidden lg:block my-2" />
            <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error/5 transition-all whitespace-nowrap">
              <LogOut size={15} /><span>Sign out</span>
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 glass-panel rounded-3xl border border-outline-variant/10 p-6 lg:p-8 min-h-[400px]">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}
