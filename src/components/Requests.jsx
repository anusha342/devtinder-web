import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { addNotification } from "../utils/notificationSlice";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const [processingRequest, setProcessingRequest] = useState(null);

  const reviewRequest = async (status, _id) => {
    setProcessingRequest(_id);
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
      
      // Show success notification
      const request = requests.find(req => req._id === _id);
      const userName = request?.fromUserId?.firstName || 'User';
      const messages = {
        'accepted': `You accepted ${userName}'s connection request! You're now connected.`,
        'rejected': `You declined ${userName}'s connection request.`
      };
      
      dispatch(addNotification({
        message: messages[status] || 'Request processed successfully',
        type: status === 'accepted' ? 'success' : 'info',
        duration: 4000
      }));
    } catch (err) {
      console.error("Error reviewing request:", err);
      dispatch(addNotification({
        message: 'Failed to process request. Please try again.',
        type: 'error',
        duration: 4000
      }));
    } finally {
      setProcessingRequest(null);
    }
  };

  const fetchRequests = async () => {
    if (requests) return;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
        timeout: 8000,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      dispatch(addRequests(res.data.data));
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Requests error:", err.message);
      // Set empty array to stop loading
      dispatch(addRequests([]));
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return <div className="flex justify-center my-10">Loading requests...</div>;

  if (requests.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="text-center max-w-md mx-auto p-8 relative z-10">
          <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-2xl transform hover:scale-105 transition-all duration-300">
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-4 font-mono">
            &lt;NoRequests/&gt;
          </h1>
          <p className="text-slate-300 text-lg mb-8 font-medium">
            You don't have any connection requests at the moment. Keep swiping to get noticed
          </p>
          <Link 
            to="/" 
            className="btn btn-lg bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 border-none hover:scale-105 transition-all duration-200 shadow-2xl text-white font-bold"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
            </svg>
            Discover People
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 font-mono">
            &lt;Requests/&gt;
          </h1>
          <p className="text-slate-300 text-xl font-medium">People who want to connect with you</p>
        </div>

        {/* Requests Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {requests.map((request, index) => {
            const { _id, firstName, lastName, photoUrl, age, gender, about } = request.fromUserId;
            const isProcessing = processingRequest === request._id;

            return (
              <div
                key={request._id}
                className="group relative bg-slate-800/80 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/10 hover:border-cyan-500/30 hover:shadow-cyan-500/20 transition-all duration-500 overflow-hidden transform hover:-translate-y-2 h-[420px] flex flex-col"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Background glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                <div className="relative z-10 flex-grow flex flex-col h-full">
                  {/* Profile Image Section */}
                  <div className="relative h-60 w-full overflow-hidden flex-shrink-0 p-3 pb-0">
                    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-lg border border-white/5">
                      <img
                        alt="profile"
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                        src={photoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent pointer-events-none"></div>
                      
                      {/* New Request Badge */}
                      <div className="absolute top-3 left-3 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg z-20">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                        New Match
                      </div>
                      
                      {/* User Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <h2 className="text-2xl font-black mb-2 bg-gradient-to-r from-white via-blue-50 to-white bg-clip-text text-transparent drop-shadow-sm">
                          {firstName} {lastName}
                        </h2>
                        {age && gender && (
                          <div className="flex items-center gap-2">
                            <span className="bg-white/10 backdrop-blur-md border border-white/10 text-white/90 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                              {age}
                            </span>
                            <span className="bg-white/10 backdrop-blur-md border border-white/10 text-white/90 px-3 py-1 rounded-full text-xs font-semibold shadow-sm capitalize">
                              {gender}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="flex-grow flex flex-col justify-between p-5 pt-4">
                    {about ? (
                      <div className="mb-4">
                        <p className="text-sm text-slate-300/80 line-clamp-2 leading-relaxed font-medium">
                          {about}
                        </p>
                      </div>
                    ) : (
                       <div className="mb-4 flex-grow flex items-center justify-center">
                          <p className="text-sm text-slate-500 italic">No bio provided</p>
                       </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-auto pt-4 border-t border-white/5">
                      <button
                        onClick={() => reviewRequest("rejected", request._id)}
                        disabled={isProcessing}
                        className="flex-1 py-3 rounded-2xl bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-red-500/50 text-slate-300 hover:text-red-400 transition-all duration-300 font-bold text-sm shadow-sm flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <span className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <>
                            <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Pass
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => reviewRequest("accepted", request._id)}
                        disabled={isProcessing}
                        className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 border border-emerald-400/50 text-white transition-all duration-300 font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing ? (
                          <span className="w-5 h-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <>
                            <svg className="w-5 h-5 group-hover/btn:scale-110 group-hover/btn:-rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            Match
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Stats */}
        <div className="text-center mt-16">
          <div className="stats shadow-2xl bg-gradient-to-r from-slate-800/80 to-slate-700/60 backdrop-blur-xl border border-slate-600/30 rounded-2xl">
            <div className="stat place-items-center p-8">
              <div className="stat-value text-4xl font-black bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
                {requests.length}
              </div>
              <div className="stat-desc font-bold text-slate-300 text-lg">Pending Requests</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link 
            to="/" 
            className="btn btn-outline btn-lg bg-slate-700/30 backdrop-blur-sm border-slate-600 hover:bg-slate-600/50 hover:border-cyan-400 transition-all duration-200 text-slate-300"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
            </svg>
            Discover More People
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Requests;