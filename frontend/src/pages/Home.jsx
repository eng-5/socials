import { useState, useEffect } from 'react';
import PostComposer from '../components/PostComposer';
import PostCard from '../components/PostCard';
import StatusReel from '../components/StatusReel';
import { createPost, getAllPosts } from '../api/posts'

// const posts = [
//   {
//     id: 1, author: 'Elena Vance', handle: '@evance', time: '2h',
//     avatar: 'https://i.pravatar.cc/150?img=5', verified: true, online: true,
//     aiSummary: true,
//     content: 'Exploring the intersection of generative geometry and obsidian-like textures in modern UI. The depth achieved through tonal layering is truly revolutionary. What do you think? 🌑',
//     image: 'https://picsum.photos/seed/obsidian1/800/450',
//     likes: 1247, comments: 84, shares: 212, liked: false,
//   },
//   {
//     id: 2, author: 'Obsidian AI', handle: '@obsidian_ai', time: '5h',
//     avatar: 'https://i.pravatar.cc/150?img=60', verified: true,
//     aiSummary: false,
//     content: 'System Update — Neural engine v4.2 is now active.',
//     aiQuote: 'Architecture update has increased inference speed by 40%. All rendering pipelines are now optimized for real-time interaction.',
//     likes: 3512, comments: 421, shares: 890, liked: true,
//   },
//   {
//     id: 3, author: 'Marcus Thorne', handle: '@mthorne', time: '8h',
//     avatar: 'https://i.pravatar.cc/150?img=12', verified: false,
//     aiSummary: false,
//     content: 'The future of social media isn\'t just connection — it\'s curated intelligence. Obsidian proves that dark aesthetics actually improve focus and reduce digital fatigue. 🌑✨',
//     image: 'https://picsum.photos/seed/darkwave/800/450',
//     likes: 892, comments: 32, shares: 156, liked: false,
//   },
//   {
//     id: 4, author: 'Aelia Rivera', handle: '@arivera', time: '12h',
//     avatar: 'https://i.pravatar.cc/150?img=9', verified: true, online: true,
//     aiSummary: true,
//     content: 'Just shipped v2 of the Obsidian component library — glass morphism, tonal elevation, micro-animations. Going open-source next week! 🎉',
//     likes: 2104, comments: 178, shares: 534, liked: false,
//   },
// ];
const posts = [];


export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await getAllPosts(1, 20);
        setPosts(res.data.posts);
      } catch (err) {
        const status = err.response?.status;
        if (status === 502 || status === 503 || status === 504 || !err.response) {
          setError('Post are temporarily unavailable. Please try again shortly');
        } else {
          setError(err.response?.data?.message || 'Could not load posts.')
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  },
    []
  );

  const handlePost = async (text) => {
    try {
      const res = await createPost(text);
      setPosts(prev => [res.data.post, ...prev]);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create post');
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 overflow-x-hidden">
      {/* Header */}
      <div className="mb-6 animate-fade-up">
        <h1 className="text-2xl font-black font-headline tracking-tight">Home</h1>
        <p className="text-sm text-on-surface-variant mt-0.5">Your curated intelligence feed</p>
      </div>

      {/* Stories/Status Reel */}
      <StatusReel />

      {/* Composer */}
      <div className="mb-8 animate-fade-up delay-100 relative mt-4">
        <PostComposer onPost={handlePost} />
      </div>

      {/* Feed */}
      <div className="space-y-5">
        {loading && (
          <div className="h-40 rounded-3xl bg-surface-container/60 animate-pulse" />
        )}
        {error && (
          <p className="text-sm text-error text-center">{error}</p>
        )}
        {!loading && !error && posts.length === 0 && (
          <p className="text-sm text-on-surface-variant text-center">No posts. Be the first!</p>
        )}
        {!loading && !error && posts.map((post, i) => (
          <div key={post._id} className="animate-fade-up" style={{ animationDelay: `${0.15 + i * 0.08}s` }}>
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {/* Load more */}
      <div className="mt-10 text-center">
        <button className="px-8 py-3 glass-pill border border-outline-variant/20 text-on-surface-variant text-sm font-semibold rounded-2xl hover:border-primary/30 hover:text-primary transition-all">
          Load more posts
        </button>
      </div>
    </div>
  );
}
