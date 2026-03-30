import { useState } from 'react';

const HelpModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const tips = [
    {
      icon: "👆",
      title: "Swipe to Connect",
      description: "Swipe right to like, left to pass, or up for super like!",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: "⌨️",
      title: "Keyboard Shortcuts",
      description: "Use arrow keys: ← Pass, → Like, ↑ Super Like",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: "📸",
      title: "Great Profile Photos",
      description: "Use clear, recent photos that show your personality",
      gradient: "from-purple-500 to-indigo-500"
    },
    {
      icon: "✍️",
      title: "Write About Yourself",
      description: "Share your interests, skills, and what you're looking for",
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: "🔍",
      title: "Be Active",
      description: "Regular activity increases your visibility to others",
      gradient: "from-orange-500 to-amber-500"
    },
    {
      icon: "💬",
      title: "Start Conversations",
      description: "Don't be shy! Send the first message to your connections",
      gradient: "from-violet-500 to-purple-500"
    }
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center z-40 hover:scale-110 animate-pulse hover:animate-none border-2 border-cyan-400/30"
        title="Help & Tips"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-3xl max-w-lg w-full max-h-[85vh] overflow-y-auto border border-slate-700/50 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-r from-slate-700/30 to-slate-600/30 border-b border-slate-600/50">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-blue-500/10 to-purple-600/10 rounded-t-3xl"></div>
              <div className="relative flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white font-mono">&lt;Tips&amp;Help/&gt;</h2>
                    <p className="text-sm text-slate-400 font-medium">Master DevTinder like a pro</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 bg-slate-700/50 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 text-slate-400 border border-slate-600/50"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-4">
                {tips.map((tip, index) => (
                  <div
                    key={index}
                    className="group flex gap-4 p-5 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 hover:bg-slate-700/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${tip.gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {tip.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-2 text-lg group-hover:text-cyan-400 transition-colors duration-300">{tip.title}</h3>
                      <p className="text-slate-300 leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Call to Action */}
              <div className="mt-8 p-6 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-600/10 rounded-2xl border border-cyan-400/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 via-blue-500/5 to-purple-600/5 animate-pulse"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="font-black text-white text-xl">Ready to Connect?</h3>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Start swiping, make meaningful connections, and build your developer network!
                    <span className="text-cyan-400 font-medium"> Your next collaboration is just a swipe away.</span>
                  </p>

                  <div className="flex items-center gap-2 mt-4 text-sm text-slate-400">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span>Pro tip: Complete your profile for better matches!</span>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                  <div className="text-2xl font-black text-cyan-400">∞</div>
                  <div className="text-xs text-slate-400 font-medium">Connections</div>
                </div>
                <div className="text-center p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                  <div className="text-2xl font-black text-purple-400">24/7</div>
                  <div className="text-xs text-slate-400 font-medium">Available</div>
                </div>
                <div className="text-center p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                  <div className="text-2xl font-black text-emerald-400">100%</div>
                  <div className="text-xs text-slate-400 font-medium">Free</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HelpModal;