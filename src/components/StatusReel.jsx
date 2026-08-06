import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Plus, X, Type, Image as ImageIcon, Send } from 'lucide-react';

const gradients = [
  'bg-gradient-to-br from-indigo-900 via-purple-900 to-black',
  'bg-gradient-to-br from-emerald-900 via-teal-900 to-black',
  'bg-gradient-to-br from-rose-900 via-red-900 to-black',
  'bg-gradient-to-br from-blue-900 via-cyan-900 to-black',
  'bg-gradient-to-br from-amber-900 via-orange-900 to-black',
];

const mockStories = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: i === 0 ? 'Elena Vance' : i === 1 ? 'Marcus T.' : i === 2 ? 'Obsidian UI' : `User ${i+1}`,
  img: 10 + i * 3,
  viewed: i > 3,
  stories: [
    { 
      id: `${i}a`, 
      type: i % 4 === 0 ? 'text' : 'image', 
      url: `https://picsum.photos/seed/s_${i}a/800/1400`, 
      text: i % 4 === 0 ? 'Just testing out the new text statuses here! Learning this UI is amazing. 🚀' : '',
      gradient: gradients[i % gradients.length],
      time: `${i + 1}h` 
    },
    ...(i % 3 === 0 ? [{ 
      id: `${i}b`, 
      type: 'image', 
      url: `https://picsum.photos/seed/s_${i}b/800/1400`, 
      time: `${i}h` 
    }] : [])
  ]
}));

export default function StatusReel() {
  const [activeUserIdx, setActiveUserIdx] = useState(null);
  const [activeStoryIdx, setActiveStoryIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [myStory, setMyStory] = useState(null); 
  
  // Creation modal state
  const [isCreating, setIsCreating] = useState(false);
  const [createText, setCreateText] = useState('');
  const [createColorIdx, setCreateColorIdx] = useState(0);
  const fileInputRef = useRef(null);

  // Combine user story dynamically if one exists
  const activeStoriesData = myStory
    ? [{ 
        id: 'me', name: 'You', img: 11, viewed: true, 
        stories: [myStory] 
      }, ...mockStories]
    : mockStories;

  // Global Esc binding
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        closeViewer();
        setIsCreating(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // --- Viewer Logic ---
  const openViewer = (idx) => {
    setActiveUserIdx(idx);
    setActiveStoryIdx(0);
    document.documentElement.style.overflow = 'hidden';
  };

  const closeViewer = () => {
    setActiveUserIdx(null);
    setActiveStoryIdx(0);
    document.documentElement.style.overflow = '';
  };

  const handleNext = () => {
    const user = activeStoriesData[activeUserIdx];
    if (activeStoryIdx < user.stories.length - 1) {
      setActiveStoryIdx(prev => prev + 1);
    } else if (activeUserIdx < activeStoriesData.length - 1) {
      setActiveUserIdx(prev => prev + 1);
      setActiveStoryIdx(0);
    } else {
      closeViewer();
    }
  };

  const handlePrev = () => {
    if (activeStoryIdx > 0) {
      setActiveStoryIdx(prev => prev - 1);
    } else if (activeUserIdx > 0) {
      setActiveUserIdx(prev => prev - 1);
      setActiveStoryIdx(activeStoriesData[activeUserIdx - 1].stories.length - 1);
    }
  };

  // Timer logic
  useEffect(() => {
    if (activeUserIdx === null || isPaused) return;
    const timer = setTimeout(() => handleNext(), 5000);
    return () => clearTimeout(timer);
  }, [activeUserIdx, activeStoryIdx, isPaused]);

  // --- Creation Logic ---
  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      postStatus({ type: 'image', url, time: 'Just now' });
    }
  };

  const handlePostText = () => {
    if (!createText.trim()) return;
    postStatus({ type: 'text', text: createText, gradient: gradients[createColorIdx], time: 'Just now' });
  };

  const postStatus = (statusObj) => {
    setMyStory({ id: 'my_new', ...statusObj });
    setIsCreating(false);
    setCreateText('');
  };

  return (
    <>
      {/* Horizontal Status Reel Container */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 mb-4 snap-x animate-fade-up">
        
        {/* Your Status Card */}
        {myStory ? (
          <button 
            onClick={() => openViewer(0)} 
            className="group relative w-24 h-36 rounded-2xl flex-shrink-0 snap-start overflow-hidden border-2 border-transparent transition-all"
          >
            {/* Display Background of their story */}
            {myStory.type === 'image' ? (
              <img src={myStory.url} className="absolute inset-0 w-full h-full object-cover brightness-75 transition-transform duration-500 group-hover:scale-110 group-hover:brightness-90" alt="Yours" />
            ) : (
              <div className={`absolute inset-0 w-full h-full ${myStory.gradient} transition-transform duration-500 group-hover:scale-110 flex items-center justify-center p-2`}>
                 <p className="text-[8px] text-white/80 line-clamp-4 leading-relaxed font-semibold">{myStory.text}</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

            {/* Float Avatar Top Left */}
            <div className="absolute top-2.5 left-2.5 w-8 h-8 rounded-full border-[2.5px] border-primary overflow-hidden shadow-lg z-10">
              <img src="https://i.pravatar.cc/150?img=11" alt="You" className="w-full h-full object-cover" />
            </div>
            {/* Tag at bottom */}
            <div className="absolute bottom-2 left-3 right-3 text-left">
              <span className="text-xs font-bold text-white drop-shadow-md truncate block">You</span>
            </div>
          </button>
        ) : (
          <button 
            onClick={() => setIsCreating(true)} 
            className="group relative w-24 h-36 rounded-2xl flex-shrink-0 snap-start overflow-hidden bg-surface-container border border-outline-variant/10 hover:border-primary/50 transition-colors flex flex-col items-center justify-between shadow-lg"
          >
            <div className="w-full h-[65%] bg-surface-container-high relative">
              <img src="https://i.pravatar.cc/150?img=11" alt="You" className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="w-full h-[35%] flex flex-col items-center justify-center relative pt-2">
               <div className="absolute -top-4 w-8 h-8 bg-primary rounded-full border-4 border-surface-container flex items-center justify-center text-on-primary group-hover:scale-110 transition-transform">
                 <Plus size={16} />
               </div>
               <span className="text-[11px] font-bold text-on-surface mt-1">Create Story</span>
            </div>
          </button>
        )}

        {/* User Statuses Rectangular Cards */}
        {mockStories.map((user, idx) => {
          const firstStory = user.stories[0];
          return (
            <button 
              key={user.id} 
              onClick={() => openViewer(myStory ? idx + 1 : idx)}
              className={`group relative w-24 h-36 rounded-2xl flex-shrink-0 snap-start overflow-hidden border-[1.5px] transition-all shadow-md ${
                user.viewed ? 'border-outline-variant/20' : 'border-primary'
              }`}
            >
              {firstStory.type === 'image' ? (
                <img src={firstStory.url} className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${user.viewed ? 'brightness-50 grayscale-[30%]' : 'brightness-75 group-hover:brightness-95'}`} alt={user.name} />
              ) : (
                <div className={`absolute inset-0 w-full h-full ${firstStory.gradient} transition-transform duration-500 group-hover:scale-110 p-2 flex items-center justify-center ${user.viewed ? 'opacity-60 grayscale-[30%]' : 'opacity-100'}`}>
                   <p className="text-[7px] text-white/50 line-clamp-5 leading-relaxed font-bold">{firstStory.text}</p>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              <div className="absolute top-2.5 left-2.5 w-9 h-9 rounded-full border-[2.5px] border-primary overflow-hidden shadow-lg z-10">
                <img src={`https://i.pravatar.cc/150?img=${user.img}`} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-2.5 left-3 right-1 text-left">
                <span className="text-[11px] font-bold text-white tracking-wide truncate block drop-shadow-md">{user.name.split(' ')[0]}</span>
              </div>
            </button>
          )
        })}
      </div>


      {/* ── CREATE STATUS MODAL (FULLSCREEN PREMIUM OVERHAUL) ── */}
      {isCreating && createPortal(
        <div className={`fixed inset-0 z-[100000] flex flex-col animate-fade-up ${gradients[createColorIdx]} transition-colors duration-500`}>
           
           {/* Top Navigation Bar */}
           <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/50 to-transparent">
             <button onClick={() => setIsCreating(false)} className="w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors">
               <X size={20} />
             </button>
             <h2 className="text-white font-bold tracking-widest uppercase text-[10px] drop-shadow-md">Create Status</h2>
             <div className="w-10" /> {/* Spacer */}
           </div>
           
           {/* Main Input Canvas */}
           <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 w-full h-full">
               <textarea 
                 autoFocus
                 placeholder="Type a Status..."
                 value={createText}
                 onChange={e => setCreateText(e.target.value)}
                 className="w-full max-w-lg bg-transparent text-center text-3xl md:text-5xl font-black text-white placeholder:text-white/50 focus:outline-none resize-none font-headline leading-tight drop-shadow-2xl"
                 rows={4}
                 maxLength={150}
               />
           </div>

           {/* Floating Bottom Controls */}
           <div className="absolute bottom-0 inset-x-0 p-6 z-50 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col gap-6 items-center">
              
              {/* Color Themes row */}
              <div className="flex items-center justify-center gap-3 bg-black/20 backdrop-blur-xl px-5 py-3 rounded-full border border-white/10 shadow-2xl">
                {gradients.map((grad, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCreateColorIdx(i)}
                    className={`w-7 h-7 rounded-full border-[2.5px] transition-all shadow-inner ${createColorIdx === i ? 'border-white scale-125' : 'border-transparent scale-100 opacity-70 hover:opacity-100'} ${grad}`}
                  />
                ))}
              </div>
              
              {/* Actions row */}
              <div className="flex gap-4 w-full max-w-sm">
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleUploadImage} />
                <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl flex flex-col items-center justify-center gap-1.5 text-white font-bold transition-all border border-white/10">
                  <ImageIcon size={22} className="opacity-80" /> 
                  <span className="text-[10px] uppercase tracking-widest">Gallery</span>
                </button>
                <button 
                  onClick={handlePostText}
                  disabled={!createText.trim()}
                  className="flex-1 py-4 bg-white text-black rounded-2xl flex flex-col items-center justify-center gap-1.5 font-bold hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                  <Send size={22} className="opacity-80" /> 
                  <span className="text-[10px] uppercase tracking-widest text-black">Upload</span>
                </button>
              </div>
           </div>
        </div>,
        document.body
      )}

      {/* ── FULLSCREEN STORY VIEWER MODAL ── */}
      {activeUserIdx !== null && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black flex items-center justify-center animate-fade-up" style={{ animationDuration: '0.2s' }}>
          
          <button onClick={closeViewer} className="absolute top-5 right-5 z-50 w-10 h-10 bg-black/20 hover:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all pointer-events-auto shadow-2xl">
            <X size={20} />
          </button>

          <div 
            className="absolute inset-0 z-40 flex"
            onPointerDown={() => setIsPaused(true)}
            onPointerUp={() => setIsPaused(false)}
            onPointerLeave={() => setIsPaused(false)}
          >
            <div className="w-[30%] h-full cursor-w-resize" onClick={handlePrev} />
            <div className="w-[70%] h-full" onClick={handleNext} />
          </div>

          <div className="relative w-full h-[100dvh] md:max-w-[420px] md:h-[90vh] md:rounded-[2rem] overflow-hidden bg-zinc-950 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col justify-between">
            
            {/* Progress Bars */}
            <div className="absolute top-0 left-0 right-0 z-50 flex gap-1.5 p-3 pt-5">
              {activeStoriesData[activeUserIdx].stories.map((story, i) => (
                <div key={story.id} className="h-[3px] flex-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                  {i < activeStoryIdx && <div className="h-full bg-white w-full" />}
                  {i === activeStoryIdx && (
                    <div 
                      className="h-full bg-white w-full origin-left" 
                      style={{ 
                        animation: `runProgress 5s linear forwards`, 
                        animationPlayState: isPaused ? 'paused' : 'running' 
                      }} 
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Header */}
            <div className="absolute top-8 left-0 right-0 z-50 px-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-3 drop-shadow-md">
                <img src={`https://i.pravatar.cc/150?img=${activeStoriesData[activeUserIdx].img}`} className="w-9 h-9 rounded-full border border-white/20" />
                <div>
                  <p className="text-white font-bold text-sm tracking-wide">{activeStoriesData[activeUserIdx].name}</p>
                  <p className="text-white/80 text-[10px] uppercase font-bold tracking-widest mt-0.5">
                    {activeStoriesData[activeUserIdx].stories[activeStoryIdx].time}
                  </p>
                </div>
              </div>
            </div>

            {/* Story Content Rendering (Image vs Text) */}
            {activeStoriesData[activeUserIdx].stories[activeStoryIdx].type === 'image' ? (
              <img 
                src={activeStoriesData[activeUserIdx].stories[activeStoryIdx].url} 
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none" 
                alt="Story Content"
              />
            ) : (
              <div className={`absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 pointer-events-none ${activeStoriesData[activeUserIdx].stories[activeStoryIdx].gradient}`}>
                 <h2 className="text-3xl lg:text-4xl font-bold font-headline text-white text-center leading-snug drop-shadow-xl">{activeStoriesData[activeUserIdx].stories[activeStoryIdx].text}</h2>
              </div>
            )}

            {/* Gradients */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

            {/* Footer */}
            <div className="absolute bottom-0 w-full p-4 pb-6 z-50 pointer-events-none">
               <div className="relative backdrop-blur-md rounded-full pointer-events-auto">
                 <input 
                   type="text" 
                   placeholder={`Reply to ${activeStoriesData[activeUserIdx].name}...`} 
                   className="w-full bg-black/30 border border-white/20 text-white placeholder:text-white/60 px-6 py-3.5 rounded-full text-sm outline-none focus:border-white/50 focus:bg-black/50 transition-all font-semibold shadow-2xl" 
                 />
               </div>
            </div>
          </div>
        </div>,
        document.body
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes runProgress {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}} />
    </>
  );
}
