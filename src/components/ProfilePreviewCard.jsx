import { useState } from "react";

const ProfilePreviewCard = ({ user }) => {
  const { firstName, lastName, photoUrl, age, gender, about, skills, interests } = user;
  const [showFullAbout, setShowFullAbout] = useState(false);

  // Use skills from user data, fallback to interests, then default
  const defaultInterests = [
    "JavaScript", "React", "Node.js", "Python", "Coffee", "Travel", 
    "Photography", "Music", "Gaming", "Fitness", "Reading", "Cooking"
  ];
  
  const userInterests = skills || interests || defaultInterests.slice(0, 6);

  return (
    <div className="group relative bg-slate-800/80 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/10 hover:border-cyan-500/30 hover:shadow-cyan-500/20 transition-all duration-500 overflow-hidden h-[540px] flex flex-col w-full max-w-sm mx-auto">
      {/* Background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Full Image Section */}
      <div className="relative h-80 w-full overflow-hidden flex-shrink-0 p-3 pb-0 z-10">
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-lg border border-white/5">
          <img 
            src={photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop"} 
            alt="profile" 
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent pointer-events-none"></div>
          
          {/* Your Profile Badge */}
          <div className="absolute top-3 left-3 bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 text-cyan-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg z-20">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
            Your Profile
          </div>
          
          {/* User Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-white via-blue-50 to-white bg-clip-text text-transparent drop-shadow-sm flex items-center gap-2">
              {firstName || "Your"} {lastName || "Name"}
              {age && <span className="bg-white/10 backdrop-blur-md border border-white/10 text-white/90 px-3 py-1 rounded-full text-sm font-semibold shadow-sm">{age}</span>}
            </h2>
            
            {/* Interests */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {userInterests.slice(0, 4).map((interest, index) => (
                <div 
                  key={index}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-sm ${
                    index < 2 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30' 
                      : 'bg-white/5 text-slate-300 border border-white/10'
                  }`}
                >
                  {interest}
                </div>
              ))}
            </div>

            {about && (
              <p className="text-sm text-slate-300/90 line-clamp-2 font-medium leading-relaxed drop-shadow-sm mb-1">
                {about || "Tell others about yourself, your skills, interests..."}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-grow flex flex-col justify-between p-5 relative z-10 pt-2">
        {/* Profile Stats */}
        <div className="stats stats-horizontal shadow-xl bg-slate-800 border border-slate-700/80 rounded-2xl w-full">
          <div className="stat place-items-center py-3 px-2">
            <div className="stat-value text-cyan-400 text-xl font-black">{photoUrl && firstName ? '100%' : '50%'}</div>
            <div className="stat-desc text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Complete</div>
          </div>
          <div className="stat place-items-center py-3 px-2">
            <div className="stat-value text-emerald-400 text-xl font-black">Active</div>
            <div className="stat-desc text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Status</div>
          </div>
          <div className="stat place-items-center py-3 px-2">
            <div className="stat-value text-purple-400 text-xl font-black">Verified</div>
            <div className="stat-desc text-slate-400 text-[10px] font-bold uppercase tracking-wider mt-1">Profile</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-center mt-auto pb-4">
          {gender && (
            <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 text-slate-300 px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 shadow-inner">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
              </svg>
              <span className="capitalize">{gender}</span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="absolute -bottom-5 -right-5 z-30 group/fab">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 border border-cyan-400/30 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover/fab:shadow-[0_0_30px_rgba(6,182,212,0.6)] group-hover/fab:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer">
          <svg className="w-6 h-6 group-hover/fab:rotate-12 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ProfilePreviewCard;