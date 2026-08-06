import { useState } from 'react';
import { Image, Film, BarChart2, Smile, Paperclip, Send, X } from 'lucide-react';

const MAX_CHARS = 280;

export default function PostComposer({ onPost }) {
  const [content, setContent]   = useState('');
  const [focused, setFocused]   = useState(false);

  const handlePost = () => {
    if (!content.trim()) return;
    onPost?.(content);
    setContent('');
    setFocused(false);
  };

  const remaining = MAX_CHARS - content.length;
  const progress  = (content.length / MAX_CHARS) * 100;
  const okToPost  = content.trim() && content.length <= MAX_CHARS;

  const actions = [
    { icon: Image,     title: 'Image',   hover: 'hover:text-primary hover:bg-primary/10' },
    { icon: Film,      title: 'GIF',     hover: 'hover:text-secondary hover:bg-secondary/10' },
    { icon: BarChart2, title: 'Poll',     hover: 'hover:text-tertiary hover:bg-tertiary/10' },
    { icon: Smile,     title: 'Emoji',   hover: 'hover:text-primary hover:bg-primary/10' },
    { icon: Paperclip, title: 'Attach',  hover: 'hover:text-on-surface hover:bg-white/5' },
  ];

  return (
    <div className={`glass-panel rounded-3xl border transition-all duration-300 relative overflow-hidden ${focused ? 'border-primary/25 shadow-[0_0_30px_rgba(167,165,255,0.08)]' : 'border-outline-variant/10'}`}>
      {focused && <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />}
      <div className="p-5 flex gap-4">
        <img src="https://i.pravatar.cc/150?img=11" alt="You" className="w-10 h-10 rounded-full object-cover border border-primary/20 flex-shrink-0" />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="What's sparking in your mind?"
            rows={focused ? 3 : 2}
            className="w-full bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-on-surface-variant/50 resize-none leading-relaxed"
          />
          <div className={`flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/10 transition-opacity duration-200 ${focused ? 'opacity-100' : 'opacity-60'}`}>
            <div className="flex gap-1">
              {actions.map(({ icon: Icon, title, hover }) => (
                <button key={title} title={title} className={`p-2 rounded-xl text-on-surface-variant transition-all ${hover}`}>
                  <Icon size={16} />
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {content.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="relative w-7 h-7">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 28 28">
                      <circle cx="14" cy="14" r="11" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-outline-variant/20" />
                      <circle
                        cx="14" cy="14" r="11" fill="none" stroke="currentColor" strokeWidth="2.5"
                        strokeDasharray={`${2 * Math.PI * 11}`}
                        strokeDashoffset={`${2 * Math.PI * 11 * (1 - progress / 100)}`}
                        className={remaining <= 20 ? 'text-error' : remaining <= 50 ? 'text-tertiary' : 'text-primary'}
                        strokeLinecap="round"
                      />
                    </svg>
                    {remaining <= 20 && <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-error">{remaining}</span>}
                  </div>
                  <button onClick={() => setContent('')} className="p-1 rounded-full text-outline hover:text-on-surface hover:bg-white/5 transition-all">
                    <X size={13} />
                  </button>
                </div>
              )}
              <button
                onClick={handlePost}
                disabled={!okToPost}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold text-sm rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={13} /> Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
