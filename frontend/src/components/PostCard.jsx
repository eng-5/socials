// PostCard.jsx
import { useState } from 'react';
import { Heart, MoreHorizontal, Bookmark } from 'lucide-react';

function timeAgo(dateString) {
  const seconds = Math.floor((Date.now() - new Date(dateString)) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function PostCard({ post }) {
  const [saved, setSaved] = useState(false);

  return (
    <article data-testid="post-card" className="bg-surface-container/60 backdrop-blur-sm rounded-3xl border border-outline-variant/8 hover:-translate-y-[3px] hover:border-outline-variant/20 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border border-outline-variant/20">
                {post.authorId.slice(0, 1).toUpperCase()}
              </div>
            </div>
            <div>
              <span className="font-bold text-on-surface text-sm">User {post.authorId.slice(0, 6)}</span>
              <br />
              <span className="text-[11px] text-on-surface-variant">{timeAgo(post.createdAt)}</span>
            </div>
          </div>
          <button className="p-1.5 rounded-full text-outline hover:text-on-surface hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100">
            <MoreHorizontal size={15} />
          </button>
        </div>

        {/* Content */}
        <p className="text-on-surface-variant leading-relaxed text-sm mb-4">{post.text}</p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/8 mt-2">
          <div className="flex items-center gap-1.5 text-sm text-on-surface-variant">
            <Heart size={17} />
            <span className="text-xs font-medium">{post.likes.length}</span>
          </div>
          <button onClick={() => setSaved(p => !p)} className={`transition-all hover:scale-110 ${saved ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
            <Bookmark size={17} className={saved ? 'fill-current' : ''} />
          </button>
        </div>
      </div>
    </article>
  );
}