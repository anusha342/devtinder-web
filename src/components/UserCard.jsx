import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { addNotification } from "../utils/notificationSlice";
import { useState, useRef, useEffect } from "react";

const UserCard = ({ user, onCardRemoved }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills, interests } = user;
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const cardRef = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });
  const lastMoveTime = useRef(Date.now());
  const velocity = useRef({ x: 0, y: 0 });
  const dragStartTime = useRef(0);

  // Use skills from user data, fallback to interests, then default
  const defaultInterests = [
    "JavaScript", "React", "Node.js", "Python", "Coffee", "Travel", 
    "Photography", "Music", "Gaming", "Fitness", "Reading", "Cooking"
  ];
  
  const userInterests = skills || interests || defaultInterests.slice(0, 6);

  const handleSendRequest = async (status, userId) => {
    try {
      // Send request in background without blocking UI
      axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true }
      ).then(() => {
        // Show success notification after request completes
        const messages = {
          'interested': `You liked ${firstName}! Hope they like you back!`,
          'ignored': `Passed on ${firstName}. Next profile coming up!`,
          'super_like': `Super liked ${firstName}! You really made an impression!`
        };
        
        dispatch(addNotification({
          message: messages[status] || `Action completed for ${firstName}`,
          type: 'success',
          duration: 3000
        }));
      }).catch((err) => {
        console.error("Error sending request:", err);
        dispatch(addNotification({
          message: `Failed to process action. Please try again.`,
          type: 'error',
          duration: 4000
        }));
      });
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };

  const animateCardExit = (direction) => {
    setIsAnimating(true);
    
    // Haptic feedback simulation for mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    const exitX = direction === 'right' ? 1000 : direction === 'left' ? -1000 : 0;
    const exitY = direction === 'up' ? -1000 : 0;
    const exitRotation = direction === 'right' ? 30 : direction === 'left' ? -30 : 0;
    
    setDragOffset({ x: exitX, y: exitY });
    setRotation(exitRotation);
    
    // Faster transition - reduced from 300ms to 150ms
    setTimeout(() => {
      let status;
      if (direction === 'right') status = 'interested';
      else if (direction === 'left') status = 'ignored';
      else if (direction === 'up') status = 'super_like';
      else status = 'ignored';
      
      // Call the callback immediately to show next card faster
      if (onCardRemoved) {
        onCardRemoved();
      }
      
      // Send request in background without blocking UI
      handleSendRequest(status, _id);
    }, 150);
  };

  // Keyboard Events
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (isAnimating) return;
      
      if (e.key === 'ArrowLeft') {
        animateCardExit('left');
      } else if (e.key === 'ArrowRight') {
        animateCardExit('right');
      } else if (e.key === 'ArrowUp') {
        animateCardExit('up');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isAnimating, _id]);

  // Enhanced Mouse Events with momentum
  const handleMouseDown = (e) => {
    if (isAnimating) return;
    e.preventDefault();
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    lastMoveTime.current = Date.now();
    dragStartTime.current = Date.now();
    velocity.current = { x: 0, y: 0 };
    
    // Add cursor style to body to prevent text selection
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
    
    // Subtle haptic feedback for supported devices
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isAnimating) return;
    
    const currentTime = Date.now();
    const deltaTime = currentTime - lastMoveTime.current;
    
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    
    // Calculate velocity for momentum
    if (deltaTime > 0) {
      velocity.current = {
        x: (deltaX - dragOffset.x) / deltaTime * 16, // Normalize to 60fps
        y: (deltaY - dragOffset.y) / deltaTime * 16
      };
    }
    
    setDragOffset({ x: deltaX, y: deltaY });
    
    // Enhanced rotation with more natural feel
    const maxRotation = 15;
    const rotationFactor = Math.min(Math.abs(deltaX) / 200, 1);
    setRotation((deltaX > 0 ? maxRotation : -maxRotation) * rotationFactor);
    
    lastMoveTime.current = currentTime;
  };

  const handleMouseUp = () => {
    if (!isDragging || isAnimating) return;
    
    setIsDragging(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    const dragDuration = Date.now() - dragStartTime.current;
    const threshold = 100; // Reduced threshold for easier swiping
    const velocityThreshold = 0.5;
    
    // Check for quick swipe (momentum-based)
    const hasQuickSwipe = Math.abs(velocity.current.x) > velocityThreshold && dragDuration < 300;
    
    if (Math.abs(dragOffset.x) > threshold || hasQuickSwipe) {
      const direction = dragOffset.x > 0 ? 'right' : 'left';
      animateCardExit(direction);
    } else if (dragOffset.y < -threshold || (velocity.current.y < -velocityThreshold && dragDuration < 300)) {
      animateCardExit('up');
    } else {
      // Smooth return animation with bounce effect
      setIsBouncing(true);
      setDragOffset({ x: 0, y: 0 });
      setRotation(0);
      
      // Reset bounce animation after it completes
      setTimeout(() => setIsBouncing(false), 600);
    }
  };

  // Enhanced Touch Events with momentum
  const handleTouchStart = (e) => {
    if (isAnimating) return;
    e.preventDefault();
    setIsDragging(true);
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
    lastMoveTime.current = Date.now();
    dragStartTime.current = Date.now();
    velocity.current = { x: 0, y: 0 };
    
    // Subtle haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || isAnimating) return;
    e.preventDefault();
    
    const currentTime = Date.now();
    const deltaTime = currentTime - lastMoveTime.current;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    
    // Calculate velocity for momentum
    if (deltaTime > 0) {
      velocity.current = {
        x: (deltaX - dragOffset.x) / deltaTime * 16,
        y: (deltaY - dragOffset.y) / deltaTime * 16
      };
    }
    
    setDragOffset({ x: deltaX, y: deltaY });
    
    // Enhanced rotation
    const maxRotation = 15;
    const rotationFactor = Math.min(Math.abs(deltaX) / 200, 1);
    setRotation((deltaX > 0 ? maxRotation : -maxRotation) * rotationFactor);
    
    lastMoveTime.current = currentTime;
  };

  const handleTouchEnd = (e) => {
    if (!isDragging || isAnimating) return;
    e.preventDefault();
    
    setIsDragging(false);
    
    const dragDuration = Date.now() - dragStartTime.current;
    const threshold = 100;
    const velocityThreshold = 0.5;
    
    // Check for quick swipe
    const hasQuickSwipe = Math.abs(velocity.current.x) > velocityThreshold && dragDuration < 300;
    
    if (Math.abs(dragOffset.x) > threshold || hasQuickSwipe) {
      const direction = dragOffset.x > 0 ? 'right' : 'left';
      animateCardExit(direction);
    } else if (dragOffset.y < -threshold || (velocity.current.y < -velocityThreshold && dragDuration < 300)) {
      animateCardExit('up');
    } else {
      setDragOffset({ x: 0, y: 0 });
      setRotation(0);
      setIsBouncing(true);
      setTimeout(() => setIsBouncing(false), 600);
    }
  };

  const getCardStyle = () => {
    // Enhanced opacity calculation with smoother transition
    const maxDistance = 300;
    const distance = Math.abs(dragOffset.x);
    const opacity = Math.max(0.7, 1 - (distance / maxDistance) * 0.3);
    
    // Enhanced scale effect for more dynamic feel
    const scale = isDragging ? Math.max(0.95, 1 - distance / 1000) : 1;
    
    // Smooth shadow effect based on drag distance
    const shadowIntensity = isDragging ? Math.min(distance / 100, 1) : 0;
    const boxShadow = `0 ${10 + shadowIntensity * 20}px ${25 + shadowIntensity * 15}px rgba(0, 0, 0, ${0.1 + shadowIntensity * 0.1})`;
    
    return {
      transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg) scale(${scale})`,
      opacity: opacity,
      transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      cursor: isDragging ? 'grabbing' : 'grab',
      zIndex: isDragging ? 10 : 1,
      boxShadow: boxShadow,
    };
  };

  const getSwipeIndicatorOpacity = (direction) => {
    const threshold = 80; // Reduced threshold for earlier feedback
    
    if (direction === 'right') {
      return Math.max(0, Math.min(1, dragOffset.x / threshold));
    } else if (direction === 'left') {
      return Math.max(0, Math.min(1, -dragOffset.x / threshold));
    } else if (direction === 'up') {
      return Math.max(0, Math.min(1, -dragOffset.y / threshold));
    }
    return 0;
  };

  // Enhanced swipe indicator scale effect
  const getSwipeIndicatorScale = (direction) => {
    const opacity = getSwipeIndicatorOpacity(direction);
    return 0.8 + (opacity * 0.4); // Scale from 0.8 to 1.2
  };

  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      {/* Main Card Container with enhanced styling */}
      <div className="relative h-[600px] w-full">
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-blue-400/20 rounded-3xl blur-xl scale-110 opacity-50"></div>
        
        {/* Card */}
        <div
          ref={cardRef}
          className={`absolute inset-0 card bg-slate-800/80 backdrop-blur-2xl shadow-2xl overflow-hidden card-drag rounded-[32px] border border-white/10 ${
            isDragging ? 'dragging no-select' : isBouncing ? 'card-bounce' : 'card-return'
          }`}
          style={getCardStyle()}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Enhanced Swipe Indicators with modern design */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-emerald-400/40 to-green-500/40 flex items-center justify-center z-20 pointer-events-none backdrop-blur-sm"
            style={{ opacity: getSwipeIndicatorOpacity('right') }}
          >
            <div 
              className="bg-gradient-to-r from-emerald-400 to-green-500 text-white px-8 py-4 rounded-2xl font-black text-3xl transform rotate-12 shadow-2xl border-2 border-white/30 backdrop-blur-sm"
              style={{ transform: `rotate(12deg) scale(${getSwipeIndicatorScale('right')})` }}
            >
              LIKE
            </div>
          </div>
          
          <div 
            className="absolute inset-0 bg-gradient-to-br from-red-400/40 to-pink-500/40 flex items-center justify-center z-20 pointer-events-none backdrop-blur-sm"
            style={{ opacity: getSwipeIndicatorOpacity('left') }}
          >
            <div 
              className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-8 py-4 rounded-2xl font-black text-3xl transform -rotate-12 shadow-2xl border-2 border-white/30 backdrop-blur-sm"
              style={{ transform: `rotate(-12deg) scale(${getSwipeIndicatorScale('left')})` }}
            >
              NOPE
            </div>
          </div>

          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-400/40 to-purple-500/40 flex items-center justify-center z-20 pointer-events-none backdrop-blur-sm"
            style={{ opacity: getSwipeIndicatorOpacity('up') }}
          >
            <div 
              className="bg-gradient-to-r from-blue-400 to-purple-500 text-white px-8 py-4 rounded-2xl font-black text-2xl shadow-2xl border-2 border-white/30 backdrop-blur-sm"
              style={{ transform: `scale(${getSwipeIndicatorScale('up')})` }}
            >
              SUPER LIKE
            </div>
          </div>

          {/* Image Container */}
          <div className="relative h-full overflow-hidden">
            <img 
              src={photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop"} 
              alt="profile" 
              className="w-full h-full object-cover"
              draggable={false}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent pointer-events-none"></div>
            


            {/* Info Button with modern design */}
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-110 z-20"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
            </button>
            
            {/* Enhanced Drag Progress Indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/20 rounded-b-3xl overflow-hidden">
              <div 
                className="h-full transition-all duration-100 ease-out rounded-b-3xl"
                style={{
                  width: `${Math.min(100, Math.abs(dragOffset.x) / 2)}%`,
                  background: dragOffset.x > 0 
                    ? 'linear-gradient(90deg, #10b981, #059669)' 
                    : dragOffset.x < 0 
                    ? 'linear-gradient(90deg, #ef4444, #dc2626)' 
                    : 'linear-gradient(90deg, #6b7280, #4b5563)',
                  opacity: isDragging ? 1 : 0,
                  boxShadow: isDragging ? '0 0 20px rgba(255,255,255,0.5)' : 'none'
                }}
              />
            </div>
            
            {/* User Info Overlay with enhanced design */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pt-12 pb-14 z-10 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent pointer-events-none">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-4xl font-black bg-gradient-to-r from-white via-blue-50 to-white bg-clip-text text-transparent drop-shadow-sm">
                  {firstName}
                </h2>
                {age && (
                  <span className="bg-white/10 backdrop-blur-md border border-white/10 text-white/90 px-3 py-1 rounded-full text-lg font-bold shadow-sm">
                    {age}
                  </span>
                )}
              </div>
              
              {/* Enhanced Interests Section */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-1.5">
                  {userInterests.slice(0, 4).map((interest, index) => (
                    <div 
                      key={index}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                        index < 2 
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30' 
                          : 'bg-white/5 text-slate-300 border border-white/10'
                      }`}
                    >
                      {interest}
                    </div>
                  ))}
                </div>
              </div>

              {/* About Section with better styling */}
              {about && (
                <p className="text-sm text-slate-300/90 line-clamp-2 font-medium leading-relaxed drop-shadow-sm mb-3">
                  {about}
                </p>
              )}
              

            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons with modern Tinder-like design */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-6 z-30">
          {/* Rewind Button */}
          <button
            className="w-12 h-12 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-200 border-2 border-white/30 backdrop-blur-sm"
            onClick={() => window.location.reload()}
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
            </svg>
          </button>

          {/* Pass Button - Enhanced */}
          <button
            onClick={() => animateCardExit('left')}
            disabled={isAnimating}
            className="w-16 h-16 bg-gradient-to-br from-red-400 to-pink-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-200 disabled:opacity-50 border-2 border-white/30 backdrop-blur-sm group"
          >
            <svg className="w-8 h-8 text-white group-hover:rotate-90 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>

          {/* Super Like Button */}
          <button
            onClick={() => animateCardExit('up')}
            disabled={isAnimating}
            className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-200 disabled:opacity-50 border-2 border-white/30 backdrop-blur-sm group"
          >
            <svg className="w-6 h-6 text-white group-hover:scale-125 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </button>

          {/* Like Button - Enhanced */}
          <button
            onClick={() => animateCardExit('right')}
            disabled={isAnimating}
            className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-200 disabled:opacity-50 border-2 border-white/30 backdrop-blur-sm group"
          >
            <svg className="w-8 h-8 text-white group-hover:scale-125 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
            </svg>
          </button>

          {/* Boost Button */}
          <button
            className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-200 border-2 border-white/30 backdrop-blur-sm group"
            onClick={() => alert('Boost feature coming soon!')}
          >
            <svg className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Enhanced Instructions with modern design */}
      <div className="text-center mt-16">
        <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-4 max-w-md mx-auto">
          <p className="text-sm flex items-center justify-center gap-6 text-base-content/80">
            <span className="flex items-center gap-2 bg-gradient-to-r from-red-400/20 to-pink-400/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-red-400/30">
              <kbd className="kbd kbd-sm bg-red-400 text-white border-none">←</kbd>
              <span className="font-medium">Pass</span>
            </span>
            <span className="flex items-center gap-2 bg-gradient-to-r from-blue-400/20 to-purple-400/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-blue-400/30">
              <kbd className="kbd kbd-sm bg-blue-400 text-white border-none">↑</kbd>
              <span className="font-medium">Super</span>
            </span>
            <span className="flex items-center gap-2 bg-gradient-to-r from-green-400/20 to-emerald-400/20 px-3 py-2 rounded-lg backdrop-blur-sm border border-green-400/30">
              <kbd className="kbd kbd-sm bg-green-400 text-white border-none">→</kbd>
              <span className="font-medium">Like</span>
            </span>
          </p>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="modal modal-open">
          <div className="modal-box">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">About {firstName}</h3>
              <button 
                onClick={() => setShowInfo(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Basic Info</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="badge badge-outline">Age: {age || 'Not specified'}</div>
                  <div className="badge badge-outline">Gender: {gender || 'Not specified'}</div>
                </div>
              </div>
              
              {about && (
                <div>
                  <h4 className="font-semibold mb-2">About</h4>
                  <div className="alert">
                    <p className="text-sm">{about}</p>
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold mb-2">Skills & Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {userInterests.map((interest, index) => (
                    <div key={index} className="badge badge-primary badge-outline">
                      {interest}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;