import { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Sparkles, BadgeCheck } from 'lucide-react';

export default function PostCard({ post }) {
  const [liked, setLiked] = useState(post.liked || false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [saved, setSaved] = useState(false);

  const handleLike = () => {
    setLiked(p => !p);
    setLikes(p => liked ? p - 1 : p + 1);
  };

  return (
    <article className="bg-surface-container/60 backdrop-blur-sm rounded-3xl border border-outline-variant/8 hover:-translate-y-[3px] hover:border-outline-variant/20 hover:shadow-2xl hover:shadow-black/20 transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover border border-outline-variant/20" />
              {post.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-surface-container" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-on-surface text-sm">{post.author}</span>
                {post.verified && <BadgeCheck size={13} className="text-primary" />}
              </div>
              <span className="text-[11px] text-on-surface-variant">{post.handle} · {post.time}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {post.aiSummary && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full border border-primary/20">
                <Sparkles size={9} /> AI
              </span>
            )}
            <button className="p-1.5 rounded-full text-outline hover:text-on-surface hover:bg-white/5 transition-all opacity-0 group-hover:opacity-100">
              <MoreHorizontal size={15} />
            </button>
          </div>
        </div>

        {/* Content */}
        <p className="text-on-surface-variant leading-relaxed text-sm mb-4">{post.content}</p>

        {/* Image */}
        {post.image && (
          <div className="rounded-2xl overflow-hidden mb-4 border border-outline-variant/10">
            <img src={post.image} alt="Post" className="w-full aspect-video object-cover group-hover:scale-[1.02] transition-transform duration-700" />
          </div>
        )}

        {/* AI Quote */}
        {post.aiQuote && (
          <div className="p-3.5 bg-primary/5 rounded-2xl border border-primary/10 mb-4 italic text-sm text-on-surface/80 leading-relaxed">
            <Sparkles size={11} className="text-primary inline mr-1.5 mb-0.5" />
            "{post.aiQuote}"
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-outline-variant/8 mt-2">
          <div className="flex gap-5">
            <button onClick={handleLike} className={`flex items-center gap-1.5 text-sm transition-all hover:scale-110 ${liked ? 'text-tertiary' : 'text-on-surface-variant hover:text-tertiary'}`}>
              <Heart size={17} className={liked ? 'fill-current' : ''} />
              <span className="text-xs font-medium">{likes.toLocaleString()}</span>
            </button>
            <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-secondary transition-all hover:scale-110">
              <MessageCircle size={17} />
              <span className="text-xs font-medium">{post.comments}</span>
            </button>
            <button className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-all hover:scale-110">
              <Share2 size={16} />
              <span className="text-xs font-medium">{post.shares}</span>
            </button>
          </div>
          <button onClick={() => setSaved(p => !p)} className={`transition-all hover:scale-110 ${saved ? 'text-primary' : 'text-on-surface-variant hover:text-primary'}`}>
            <Bookmark size={17} className={saved ? 'fill-current' : ''} />
          </button>
        </div>
      </div>
    </article>
  );
}
