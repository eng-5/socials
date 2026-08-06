import { useState } from 'react';
import { Map, Navigation, Zap, Music, Coffee, Users, Star, Clock, ChevronRight } from 'lucide-react';

const filters = ['All Events', 'Live Now', 'Tonight', 'Music', 'Tech', 'Art'];

const events = [
  {
    id: 1, title: 'Neural Art Exhibition',  category: 'Art',   distance: '0.4 km',
    time: 'Live Now',   attendees: 124, img: 'artgallery', accent: 'primary',
    icon: Star, dot: { x: '30%', y: '40%' }, hot: true,
  },
  {
    id: 2, title: 'Obsidian Dev Meetup',    category: 'Tech',  distance: '1.2 km',
    time: '8:00 PM',    attendees: 67,  img: 'techconf',  accent: 'secondary',
    icon: Zap, dot: { x: '60%', y: '55%' }, hot: false,
  },
  {
    id: 3, title: 'AI Music Synthesis',     category: 'Music', distance: '2.1 km',
    time: '9:30 PM',    attendees: 89,  img: 'concert1',  accent: 'tertiary',
    icon: Music, dot: { x: '45%', y: '25%' }, hot: false,
  },
  {
    id: 4, title: 'Dark Matter Coffee Jam', category: 'Social', distance: '0.8 km',
    time: 'Now – 11 PM', attendees: 42, img: 'cafe1',    accent: 'primary',
    icon: Coffee, dot: { x: '72%', y: '35%' }, hot: false,
  },
];

const accentText = { primary: 'text-primary', secondary: 'text-secondary', tertiary: 'text-tertiary' };
const accentBg   = { primary: 'bg-primary/15', secondary: 'bg-secondary/15', tertiary: 'bg-tertiary/15' };
const accentBorder = { primary: 'border-primary/30', secondary: 'border-secondary/30', tertiary: 'border-tertiary/30' };
const accentShadow = { primary: 'shadow-primary/10', secondary: 'shadow-secondary/10', tertiary: 'shadow-tertiary/10' };

export default function DiscoveryMap() {
  const [activeFilter, setActiveFilter] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(1);

  const selected = events.find(e => e.id === selectedEvent);

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden">

      {/* ── Map Canvas ── */}
      <div className="flex-1 relative overflow-hidden min-h-72 lg:min-h-0">
        {/* Gradient map background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/40 to-slate-950">
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(#a7a5ff 1px, transparent 1px), linear-gradient(90deg, #a7a5ff 1px, transparent 1px)', backgroundSize: '60px 60px' }}
          />
          {/* Glows */}
          <div className="absolute top-[30%] left-[25%] w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-[50%] right-[25%] w-32 h-32 bg-secondary/10 rounded-full blur-3xl" />

          {/* Event Dots */}
          {events.map(event => {
            const Icon = event.icon;
            const isSelected = event.id === selectedEvent;
            return (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 group"
                style={{ left: event.dot.x, top: event.dot.y }}
              >
                {isSelected && (
                  <span className={`absolute inset-0 rounded-full ${accentBg[event.accent]} animate-ping-slow`} style={{ width: '3rem', height: '3rem', top: '-0.5rem', left: '-0.5rem' }} />
                )}
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-xl transition-all duration-300 ${
                  isSelected
                    ? `${accentBg[event.accent]} border-current ${accentText[event.accent]} scale-125`
                    : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:scale-110'
                }`}>
                  <Icon size={15} />
                </div>
                {isSelected && (
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap glass-pill px-3 py-1 rounded-full text-[10px] font-bold text-on-surface border border-outline-variant/20 shadow-xl">
                    {event.title}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <button className="w-9 h-9 glass-card border border-outline-variant/20 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors shadow-lg">
            <Navigation size={15} />
          </button>
          <button className="w-9 h-9 glass-card border border-outline-variant/20 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors text-lg font-bold shadow-lg">+</button>
          <button className="w-9 h-9 glass-card border border-outline-variant/20 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors text-lg font-bold shadow-lg">−</button>
        </div>

        {/* Filter Pills (overlaid on map) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto no-scrollbar max-w-[90vw] px-2">
          {filters.map((f, i) => (
            <button
              key={f}
              onClick={() => setActiveFilter(i)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-lg ${
                activeFilter === i
                  ? 'bg-primary text-on-primary shadow-primary/30'
                  : 'glass-card border border-outline-variant/20 text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── Right Panel: Event List ── */}
      <aside className="w-full lg:w-96 flex flex-col bg-surface-container-low/60 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-outline-variant/10 overflow-y-auto no-scrollbar">
        <div className="p-5 border-b border-outline-variant/8">
          <div className="flex items-center gap-2 mb-1">
            <Map size={16} className="text-primary" />
            <h2 className="font-bold font-headline text-lg">Nearby Events</h2>
          </div>
          <p className="text-xs text-on-surface-variant">
            <span className="text-emerald-400 font-semibold">4</span> events within 3km
          </p>
        </div>

        <div className="flex-1 p-4 space-y-3">
          {events.map((event) => {
            const Icon = event.icon;
            const isSelected = event.id === selectedEvent;
            return (
              <button
                key={event.id}
                onClick={() => setSelectedEvent(event.id)}
                className={`w-full text-left rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isSelected
                    ? `${accentBorder[event.accent]} shadow-lg ${accentShadow[event.accent]}`
                    : 'border-outline-variant/10 hover:border-outline-variant/25'
                }`}
              >
                <div className="relative aspect-video">
                  <img
                    src={`https://picsum.photos/seed/${event.img}/400/220`}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest glass-pill border border-outline-variant/15 ${accentText[event.accent]}`}>
                      {event.category}
                    </span>
                  </div>
                  {event.hot && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-error/80 text-white text-[10px] font-black uppercase tracking-wide">
                      Live
                    </div>
                  )}
                </div>
                <div className={`p-4 ${isSelected ? accentBg[event.accent] : 'bg-surface-container/60'}`}>
                  <h3 className="font-bold text-sm text-on-surface mb-1">{event.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] text-on-surface-variant">
                      <span className="flex items-center gap-1"><Clock size={11} /> {event.time}</span>
                      <span className="flex items-center gap-1"><Users size={11} /> {event.attendees}</span>
                      <span className="flex items-center gap-1"><Navigation size={11} /> {event.distance}</span>
                    </div>
                    <ChevronRight size={14} className={`${accentText[event.accent]} ${isSelected ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
