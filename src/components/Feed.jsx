import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";
import LoadingSkeleton from "./LoadingSkeleton";
import { Link } from "react-router-dom";

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const getFeed = async (append = false) => {
    // Prevent multiple simultaneous requests
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    // Add a timeout to the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
        timeout: 8000,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (append && feed) {
        // Only add new users that aren't already in the feed
        const existingIds = new Set(feed.map(u => u._id));
        const newUsers = res?.data?.data?.filter(u => !existingIds.has(u._id)) || [];
        if (newUsers.length > 0) {
          dispatch(addFeed([...feed, ...newUsers]));
        }
      } else {
        dispatch(addFeed(res?.data?.data));
        setCurrentCardIndex(0);
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Feed error:", err.message);
      setError("Failed to load feed. Please try again.");
      
      // If we have an existing feed, don't clear it on error
      if (!feed) {
        dispatch(addFeed([]));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardRemoved = () => {
    const newIndex = currentCardIndex + 1;
    setCurrentCardIndex(newIndex);
    
    // Pre-fetch more users when we're running low
    if (feed && feed.length - newIndex <= 3) {
      getFeed(true);
    }
  };

  useEffect(() => {
    // Only fetch if we don't have a feed or it's empty
    if (!feed || feed.length === 0) {
      getFeed();
    }
  }, []);

  // Show loading skeleton for initial load
  if (isLoading && (!feed || feed.length === 0)) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="w-full max-w-md px-4 mt-20 relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 font-mono animate-pulse">
              &lt;Searching/&gt;
            </h1>
            <p className="text-slate-300 text-lg font-medium">Finding amazing developers near you...</p>
          </div>
          <LoadingSkeleton type="card" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error && (!feed || feed.length === 0)) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] bg-base-200">
        <div className="text-center p-8 bg-base-100 rounded-2xl border border-error/20 shadow-xl max-w-sm w-full">
          <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Oops!</h2>
          <p className="text-base-content/70 mb-6">{error}</p>
          <button 
            onClick={() => { setError(null); getFeed(); }}
            className="btn btn-primary w-full shadow-lg hover:shadow-primary/50"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!feed || feed.length <= currentCardIndex) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        {/* Floating Developer Icons */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-1/4 left-1/4 animate-bounce" style={{ animationDuration: '3s' }}>
            <svg className="w-12 h-12 text-cyan-400" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm2.88-6h-1.6c-.14 0-.28-.06-.38-.17l-1.92-2.06v2.13c0 .06-.05.1-.1.1H9.42c-.06 0-.1-.04-.1-.13l-.01-5.74c0-.06.05-.1.1-.1h1.46c.06 0 .1.04.1.13v3.83l2.84-2.85c.1-.1.25-.16.39-.16h1.56c.07 0 .12.06.08.13l-3 2.92 3.1 2.96c.04.05 0 .11-.06.11z"/></svg>
          </div>
          <div className="absolute bottom-1/4 right-1/4 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <svg className="w-16 h-16 text-purple-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </div>
        </div>
        
        <div className="text-center p-10 bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-700/50 shadow-2xl max-w-sm w-full mx-4 transform hover:scale-105 transition-all duration-300 relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/20 transform rotate-12 hover:rotate-0 transition-all duration-300">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 10a1 1 0 01-1 1H7a1 1 0 01-1-1v-2a1 1 0 011-1h1a1 1 0 011 1v2z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 10a1 1 0 01-1 1h-1a1 1 0 01-1-1v-2a1 1 0 011-1h1a1 1 0 011 1v2z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16c2.5 0 4.5-1.5 5.5-3.5H6.5C7.5 14.5 9.5 16 12 16z"></path>
            </svg>
          </div>
          
          <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
            All Caught Up!
          </h2>
          <p className="text-slate-300 mb-8 font-medium leading-relaxed">
            You've seen all the amazing developers in your area. Come back later for new profiles.
          </p>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => {
                setCurrentCardIndex(0);
                getFeed();
              }}
              className="btn btn-lg w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 border-none shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] text-white"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh Feed
            </button>
            <Link 
              to="/editprofile"
              className="btn btn-lg w-full bg-slate-700/50 hover:bg-slate-700 text-white border border-slate-600 shadow-xl hover:scale-[1.02] mt-2 group"
            >
              <svg className="w-5 h-5 mr-2 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Update Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentUser = feed[currentCardIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden flex flex-col items-center justify-center pt-20 pb-10">
      {/* Animated Background Layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000" />
      </div>

      {/* Code-like Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <div className="absolute top-20 left-10 text-cyan-400 font-mono text-sm">
          const developers = &#123;<br/>
          &nbsp;&nbsp;ready: true,<br/>
          &nbsp;&nbsp;skills: ['React', 'Node']<br/>
          &#125;;
        </div>
        <div className="absolute bottom-20 right-10 text-purple-400 font-mono text-sm">
          async function findMatch() &#123;<br/>
          &nbsp;&nbsp;await connect();<br/>
          &#125;
        </div>
      </div>

      {/* Header text with animation */}
      <div className="text-center mb-8 relative z-10 w-full animate-fade-in-down px-4">
        <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 font-mono tracking-tight drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
          &lt;Discover/&gt;
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 font-medium">Find your next coding partner</p>
      </div>

      {/* Cards Container */}
      <div className="relative w-full max-w-sm flex-1 flex items-center justify-center z-20 perspective-1000">
        {/* Background stack effect with premium styling */}
        {feed.length > currentCardIndex + 2 && (
          <div className="absolute w-[90%] h-[550px] bg-slate-800/60 backdrop-blur-xl rounded-[2.5rem] mt-[50px] opacity-40 shadow-2xl transition-all duration-300 transform scale-95 origin-bottom border border-slate-700/50"></div>
        )}
        {feed.length > currentCardIndex + 1 && (
          <div className="absolute w-[95%] h-[580px] bg-slate-800/80 backdrop-blur-xl rounded-[2.5rem] mt-[25px] opacity-70 shadow-2xl transition-all duration-300 transform scale-[0.98] origin-bottom border border-slate-700/50"></div>
        )}
        
        {/* Top interactive card */}
        <div className="relative w-full h-full z-10">
          <UserCard user={currentUser} onCardRemoved={handleCardRemoved} />
        </div>
      </div>

      {/* Loading indicator when fetching more */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className={`transition-all duration-300 ease-in-out ${isLoading ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}>
          <div className="bg-slate-800/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl border border-slate-700/50 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-bold text-slate-200 uppercase tracking-wider">Loading more</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Feed;