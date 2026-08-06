import { useState } from 'react';
import { Search, TrendingUp, Rocket, BadgeCheck, ArrowRight } from 'lucide-react';

const categories = ['All Discoveries', 'Tech', 'Art', 'News', 'Architecture', 'Neuroscience', 'Design'];

const trending = [
  { rank: '01', tag: '#NeuralArtGen',   score: '98.4', cat: 'AI Pulse' },
  { rank: '02', tag: '#QuantumLeap',    score: '92.1', cat: 'AI Pulse' },
  { rank: '03', tag: '#ObsidianVibe',   score: '89.7', cat: 'AI Pulse' },
  { rank: '04', tag: '#CinematicUI',    score: '85.2', cat: 'Design' },
];

// Full class strings here so Tailwind v4 scanner picks them up at build time
const CREATOR_OVERLAY = {
  primary:   'bg-gradient-to-b from-primary/5 to-transparent',
  secondary: 'bg-gradient-to-b from-secondary/5 to-transparent',
  tertiary:  'bg-gradient-to-b from-tertiary/5 to-transparent',
};
const CREATOR_GLOW = {
  primary:   'bg-gradient-to-tr from-primary to-violet-500',
  secondary: 'bg-gradient-to-tr from-secondary to-violet-500',
  tertiary:  'bg-gradient-to-tr from-tertiary to-violet-500',
};
const FOLLOW_BTN_ACTIVE = {
  primary:   'bg-primary/15 text-primary border-primary/30',
  secondary: 'bg-secondary/15 text-secondary border-secondary/30',
  tertiary:  'bg-tertiary/15 text-tertiary border-tertiary/30',
};

const creators = [
  { name: '@lucid_dreamer', bio: 'Algorithmic Artist',  img: 5,  color: 'primary' },
  { name: '@nova_tech',      bio: 'AI Researcher',       img: 6,  color: 'secondary' },
  { name: '@pixel_purist',   bio: 'UI Architect',        img: 7,  color: 'primary' },
  { name: '@cyber_flow',     bio: 'Synthesizer',         img: 8,  color: 'tertiary' },
  { name: '@atlas_prime',    bio: 'Data Sculptor',       img: 15, color: 'secondary' },
];

const recommended = [
  { title: 'The Future of Generative Motion',       category: 'Art + Tech', img: 'neural',  accent: 'primary',    author: '@synapse_void' },
  { title: 'Connecting the Silos',                  category: 'Global',     img: 'global',  accent: 'secondary',  author: '@atlas_prime' },
  { title: 'Obsidian Core 2.0 — Silicon Photonics', category: 'Hardware',   img: 'silicon', accent: 'tertiary',   author: '@silicon_sage' },
];

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchFocused, setSearchFocused]   = useState(false);
  const [followed, setFollowed]             = useState({});

  return (
    <div className="min-h-screen pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10">

        {/* ── Hero Search ── */}
        <section className="mb-12 animate-fade-up">
          <div className="relative w-full max-w-3xl mx-auto group">
            <div className={`absolute -inset-1 rounded-3xl blur-2xl transition-opacity duration-500 bg-gradient-to-r from-primary/20 to-secondary/20 ${searchFocused ? 'opacity-100' : 'opacity-30'}`} />
            <div className={`relative flex items-center bg-surface-container-highest/60 backdrop-blur-3xl border rounded-3xl px-6 py-5 shadow-2xl transition-all duration-300 ${searchFocused ? 'border-primary/40' : 'border-outline-variant/15'}`}>
              <Search size={20} className={`mr-4 flex-shrink-0 transition-colors ${searchFocused ? 'text-primary' : 'text-outline'}`} />
              <input
                type="text"
                placeholder="Explore the obsidian collective..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="bg-transparent border-none outline-none text-lg w-full text-on-surface placeholder:text-on-surface-variant/50 font-headline"
              />
              <kbd className="hidden md:flex items-center px-2.5 py-1 bg-surface-bright text-[10px] font-mono rounded-lg text-on-surface-variant border border-outline-variant/30 flex-shrink-0">⌘K</kbd>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-7">
            {categories.map((cat, i) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(i)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                  activeCategory === i
                    ? 'bg-primary text-on-primary shadow-lg shadow-primary/25'
                    : 'glass-pill border border-outline-variant/15 text-on-surface-variant hover:text-on-surface hover:border-primary/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* ── Trending Bento Grid ── */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-5 mb-14 animate-fade-up delay-100">
          {/* Large trending card */}
          <div className="md:col-span-8 bg-surface-container-low/50 backdrop-blur-sm rounded-3xl p-6 lg:p-8 relative overflow-hidden group border border-outline-variant/10 hover:border-primary/25 transition-all duration-500">
            <div className="absolute -top-10 -right-10 w-56 h-56 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors duration-700" />
            <div className="relative z-10">
              <h3 className="font-headline text-xl font-bold mb-6 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-primary/10 text-primary"><TrendingUp size={18} /></span>
                Trending Now
              </h3>
              <div className="space-y-3">
                {trending.map(({ rank, tag, score, cat }) => (
                  <div key={tag} className="flex items-center justify-between p-4 bg-surface-container rounded-2xl border border-outline-variant/5 hover:bg-surface-container-high hover:border-primary/15 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-black text-outline">{rank}</span>
                      <span className="font-mono text-primary font-bold text-sm">{tag}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-widest">{cat}</div>
                      <div className="text-sm font-bold text-tertiary">{score}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stat mini-cards */}
          <div className="md:col-span-4 flex flex-col gap-5">
            <div className="flex-1 bg-surface-container rounded-3xl p-6 flex flex-col justify-between border border-outline-variant/10 hover:border-secondary/25 transition-all group cursor-pointer">
              <span className="text-secondary group-hover:scale-110 transition-transform inline-block"><Rocket size={32} /></span>
              <div>
                <div className="text-4xl font-black font-headline text-on-surface">4.2k</div>
                <div className="text-xs text-on-surface-variant font-semibold uppercase tracking-widest mt-1">Active Creators</div>
              </div>
            </div>
            <div className="flex-1 bg-primary/5 rounded-3xl p-6 flex flex-col justify-between border border-primary/10 hover:border-primary/30 transition-all group cursor-pointer">
              <TrendingUp size={32} className="text-primary group-hover:rotate-12 transition-transform" />
              <div>
                <div className="text-4xl font-black font-headline text-on-surface">12</div>
                <div className="text-xs text-on-surface-variant font-semibold uppercase tracking-widest mt-1">New AI Hubs</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Top Creators Horizontal Scroll ── */}
        <section className="mb-14 animate-fade-up delay-200">
          <div className="flex justify-between items-end mb-7">
            <div>
              <h2 className="text-2xl lg:text-3xl font-black font-headline tracking-tight">Top Creators</h2>
              <p className="text-sm text-on-surface-variant mt-1">Architects of the new digital age</p>
            </div>
            <button className="text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar snap-x">
            {creators.map(({ name, bio, img, color }) => (
              <div key={name} className="flex-none w-52 snap-start group relative">
                <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${CREATOR_OVERLAY[color]}`} />
                <div className="relative bg-surface-container-high/30 backdrop-blur-md border border-outline-variant/10 rounded-3xl p-6 text-center transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-black/20 group-hover:border-outline-variant/25">
                  <div className="relative w-20 h-20 mx-auto mb-5">
                    <div className={`absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-60 transition-opacity duration-500 ${CREATOR_GLOW[color]}`} />
                    <img
                      src={`https://i.pravatar.cc/150?img=${img}`}
                      alt={name}
                      className="relative w-full h-full object-cover rounded-full border-2 border-outline-variant/20"
                    />
                    <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-primary rounded-full border-2 border-background flex items-center justify-center">
                      <BadgeCheck size={9} className="text-on-primary" />
                    </div>
                  </div>
                  <h4 className="font-bold text-on-surface text-sm mb-0.5">{name}</h4>
                  <p className="text-[11px] text-on-surface-variant mb-4">{bio}</p>
                  <button
                    onClick={() => setFollowed(p => ({ ...p, [name]: !p[name] }))}
                    className={`w-full py-2 rounded-xl text-[11px] font-bold transition-all active:scale-95 ${
                      followed[name]
                        ? FOLLOW_BTN_ACTIVE[color]
                        : 'bg-surface-variant text-on-surface hover:bg-primary hover:text-on-primary'
                    }`}
                  >
                    {followed[name] ? 'Following ✓' : 'Follow'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Recommended Posts Grid ── */}
        <section>
          <h2 className="text-2xl font-black font-headline tracking-tight mb-7">Recommended for You</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map(({ title, category, img, accent, author }) => (
              <article key={title} className={`group bg-surface-container/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-outline-variant/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ${
                accent === 'primary' ? 'hover:border-primary/20' : accent === 'secondary' ? 'hover:border-secondary/20' : 'hover:border-tertiary/20'
              }`}>
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={`https://picsum.photos/seed/${img}/600/340`}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute top-3 left-3 glass-pill px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    accent === 'primary' ? 'text-primary' : accent === 'secondary' ? 'text-secondary' : 'text-tertiary'
                  }`}>
                    {category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className={`font-headline font-bold text-base mb-2 transition-colors leading-snug ${
                    accent === 'primary' ? 'group-hover:text-primary' : accent === 'secondary' ? 'group-hover:text-secondary' : 'group-hover:text-tertiary'
                  }`}>{title}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs font-bold text-on-surface-variant">{author}</span>
                    <div className={`text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity ${
                      accent === 'primary' ? 'text-primary' : accent === 'secondary' ? 'text-secondary' : 'text-tertiary'
                    }`}>
                      Read →
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
