import { useState } from 'react';
import { Edit3, BadgeCheck, Grid3X3, Heart, Bookmark, BarChart2, Play } from 'lucide-react';

const tabs = [
  { label: 'Posts',    icon: Grid3X3 },
  { label: 'Media',    icon: Play },
  { label: 'Likes',    icon: Heart },
  { label: 'Insights', icon: BarChart2 },
];

const mediaGrid = [
  { id: 1, seed: 'neon1', span: 'md:col-span-2 md:row-span-2', aspect: 'aspect-video md:aspect-auto', featured: true, label: 'Synthetics UI Kit' },
  { id: 2, seed: 'circuit', span: '',   aspect: 'aspect-square', video: true },
  { id: 3, seed: 'nebula', span: '',   aspect: 'aspect-square' },
  { id: 4, seed: 'hallway', span: '',  aspect: 'aspect-square' },
  { id: 5, seed: 'desk1', span: '',    aspect: 'aspect-square' },
  { id: 6, seed: 'earth2', span: '',   aspect: 'aspect-square' },
];

const stats = [
  { value: '12.4k', label: 'Followers' },
  { value: '842',   label: 'Following' },
  { value: '156',   label: 'Posts' },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="pb-24 lg:pb-10">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 pt-4 space-y-6">

        {/* ── Profile Header Card ── */}
        <section className="relative rounded-3xl overflow-hidden glass-panel border border-outline-variant/10 shadow-2xl animate-fade-up">
          {/* Cover */}
          <div className="h-52 sm:h-64 relative overflow-hidden">
            <img
              src="https://picsum.photos/seed/obsidiancover/1200/400"
              alt="Cover"
              className="w-full h-full object-cover blur-sm scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/40 to-transparent" />
          </div>

          {/* Info overlay */}
          <div className="px-6 sm:px-8 pb-8 -mt-20 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
                {/* Avatar */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-br from-primary to-secondary rounded-full blur opacity-50 group-hover:opacity-90 transition-opacity duration-500" />
                  <img
                    src="https://i.pravatar.cc/150?img=11"
                    alt="Kaelen Vance"
                    className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-surface-container object-cover shadow-2xl"
                  />
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-primary rounded-full border-2 border-surface-container flex items-center justify-center shadow">
                    <BadgeCheck size={11} className="text-on-primary" />
                  </div>
                </div>
                {/* Name & bio */}
                <div className="text-center sm:text-left mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight">Kaelen Vance</h1>
                  <p className="text-primary font-semibold text-sm mt-0.5">@kaelen_obsidian</p>
                  <p className="mt-2.5 text-on-surface-variant text-sm leading-relaxed max-w-md">
                    Digital architect & AI enthusiast. Building the next generation of social interaction at{' '}
                    <span className="text-secondary font-semibold">Obsidian Lab</span>.
                  </p>
                </div>
              </div>
              {/* Edit button */}
              <button className="flex items-center gap-2 px-5 py-2.5 glass-card border border-outline-variant/20 rounded-xl font-semibold text-sm hover:border-primary/30 hover:bg-primary/5 hover:-translate-y-0.5 transition-all self-center sm:self-end">
                <Edit3 size={15} />
                Edit Profile
              </button>
            </div>

            {/* Stats */}
            <div className="mt-7 flex justify-center sm:justify-start gap-10 pt-7 border-t border-outline-variant/10">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center sm:text-left group cursor-pointer">
                  <span className="block text-2xl font-black font-headline text-on-surface group-hover:text-primary transition-colors">{value}</span>
                  <span className="text-[11px] text-on-surface-variant font-semibold uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Content Tabs ── */}
        <div className="sticky top-16 z-30 flex gap-1 bg-background/60 backdrop-blur-xl border-b border-outline-variant/10 animate-fade-up delay-100">
          {tabs.map(({ label, icon: Icon }, i) => (
            <button
              key={label}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-all relative ${
                activeTab === i
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Icon size={14} />
              {label}
              {activeTab === i && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ── Media Bento Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-up delay-200">
          {mediaGrid.map(({ id, seed, span, aspect, featured, label, video }) => (
            <div key={id} className={`group relative rounded-3xl overflow-hidden ${span} ${aspect} border border-outline-variant/10 hover:border-outline-variant/25 transition-all duration-500`}>
              <img
                src={`https://picsum.photos/seed/${seed}/600/600`}
                alt=""
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              {/* Featured overlay */}
              {featured && (
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Featured Project</span>
                  <h3 className="text-lg font-bold font-headline text-white">{label}</h3>
                </div>
              )}
              {/* Video badge */}
              {video && (
                <div className="absolute top-3 right-3 glass-card p-1.5 rounded-xl border border-outline-variant/20">
                  <Play size={14} className="text-primary" />
                </div>
              )}
              {/* Hover overlay for non-featured */}
              {!featured && (
                <div className="absolute inset-0 bg-surface-container/20 group-hover:bg-transparent transition-colors duration-300" />
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
