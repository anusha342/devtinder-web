import { useState } from "react";
import { Link } from "react-router-dom";

const ConnectionCard = ({ connection }) => {
  const { _id, firstName, lastName, photoUrl, age, gender, about, skills, interests } = connection;
  const [showInfo, setShowInfo] = useState(false);

  // Use skills from connection data, fallback to interests, then default
  const defaultInterests = [
    "JavaScript", "React", "Node.js", "Python", "Coffee", "Travel", 
    "Photography", "Music", "Gaming", "Fitness", "Reading", "Cooking"
  ];
  
  const userInterests = skills || interests || defaultInterests.slice(0, 4);

  return (
    <div className="group relative bg-slate-800/80 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/10 hover:border-cyan-500/30 hover:shadow-cyan-500/20 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 h-[440px] flex flex-col">
      {/* Background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      <div className="relative z-10 flex-grow flex flex-col h-full">
        {/* Profile Image Section */}
        <div className="relative h-56 w-full flex-shrink-0 p-3 pb-0">
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-lg border border-white/5">
            <img
              src={photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop"}
              alt="profile"
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent pointer-events-none"></div>
            
            {/* Connected Badge */}
            <div className="absolute top-3 left-3 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg z-20">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
              Connected
            </div>

            {/* Info Button */}
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all duration-200 hover:scale-110 z-20"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
            </button>
            
            {/* User Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
              <h2 className="text-xl font-black mb-2 bg-gradient-to-r from-white via-blue-50 to-white bg-clip-text text-transparent drop-shadow-sm flex items-center gap-2 leading-tight">
                {firstName} {lastName} 
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                {age && <span className="bg-white/10 backdrop-blur-md border border-white/10 text-white/90 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">{age}</span>}
                {gender && <span className="bg-white/10 backdrop-blur-md border border-white/10 text-white/90 px-3 py-1 rounded-full text-xs font-semibold shadow-sm capitalize">{gender}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex-grow flex flex-col justify-between p-4 pt-3">
          <div className="mb-4">
            {/* Interests Highlights */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {userInterests.slice(0, 3).map((interest, index) => (
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

            {about ? (
              <p className="text-sm text-slate-300/80 line-clamp-2 leading-relaxed font-medium">
                {about}
              </p>
            ) : (
               <p className="text-sm text-slate-500 italic">No bio provided</p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 mt-auto pt-4 border-t border-white/5">
            <button
              onClick={() => setShowInfo(true)}
              className="flex-1 py-3 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 transition-all duration-300 font-bold text-sm shadow-sm flex items-center justify-center gap-2 group/btn"
            >
              <svg className="w-4 h-4 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View
            </button>
            
            <Link 
              to={`/chat/${_id}`}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border border-cyan-400/50 text-white transition-all duration-300 font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 group/btn"
            >
              <svg className="w-4 h-4 group-hover/btn:scale-110 group-hover/btn:-rotate-12 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
              </svg>
              Message
            </Link>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="modal modal-open">
          <div className="modal-box bg-slate-800 border border-slate-700 max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-white">About {firstName}</h3>
              <button 
                onClick={() => setShowInfo(false)}
                className="btn btn-sm btn-circle btn-ghost text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-slate-300">Basic Info</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="badge badge-outline border-slate-600 text-slate-300">Age: {age || 'Not specified'}</div>
                  <div className="badge badge-outline border-slate-600 text-slate-300">Gender: {gender || 'Not specified'}</div>
                </div>
              </div>
              
              {about && (
                <div>
                  <h4 className="font-semibold mb-2 text-slate-300">About</h4>
                  <div className="alert bg-slate-700/50 border-slate-600">
                    <p className="text-sm text-slate-300">{about}</p>
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold mb-2 text-slate-300">Skills & Interests</h4>
                <div className="flex flex-wrap gap-2">
                  {userInterests.map((interest, index) => (
                    <div key={index} className="badge bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-none">
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

export default ConnectionCard;