import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { addNotification } from "../utils/notificationSlice";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const requests = useSelector((store) => store.requests);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dropdownMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isInsideToggle = dropdownRef.current?.contains(event.target);
      const isInsideMenu = dropdownMenuRef.current?.contains(event.target);
      
      if (showDropdown && !isInsideToggle && !isInsideMenu) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogout = async () => {
    setShowDropdown(false);
    
    try {
      dispatch(removeUser());
      
      navigate("/login", { replace: true });
      
      try {
        await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      } catch (apiErr) {
        console.error("Logout API error:", apiErr);
      }
      
    } catch (err) {
      console.error("Logout error:", err);
      dispatch(removeUser());
      navigate("/login", { replace: true });
    }
  };

  const handleProfileClick = () => {
    setShowDropdown(false);
    navigate("/editprofile", { replace: true });
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  const pendingRequestsCount = requests?.length || 0;

  return (
    <div className="navbar bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 text-white shadow-2xl border-b border-slate-700/50 backdrop-blur-xl">
      <div className="navbar-start">
        <Link to="/feed" className="btn btn-ghost text-xl font-bold hover:bg-slate-700/50 transition-all duration-300">
          <div className="avatar">
            <div className="w-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-lg">
              <div className="flex items-center justify-center h-full text-2xl">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                  <path d="M8 11l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-start ml-2">
            <span className="text-cyan-400 font-black font-mono text-lg">&lt;DevTinder/&gt;</span>
            <span className="text-xs opacity-70 font-medium">Connect & Code</span>
          </div>
        </Link>
      </div>
      
      {user && (
        <>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 gap-3">
              <li>
                <Link to="/feed" className="btn btn-ghost btn-sm hover:bg-slate-700/50 hover:text-cyan-400 transition-all duration-200 rounded-xl">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                  </svg>
                  <span className="font-medium">Discover</span>
                </Link>
              </li>
              <li>
                <Link to="/connections" className="btn btn-ghost btn-sm hover:bg-slate-700/50 hover:text-cyan-400 transition-all duration-200 rounded-xl">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                  </svg>
                  <span className="font-medium">Network</span>
                </Link>
              </li>
              <li>
                <Link to="/requests" className="btn btn-ghost btn-sm indicator hover:bg-slate-700/50 hover:text-cyan-400 transition-all duration-200 rounded-xl">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"/>
                  </svg>
                  <span className="font-medium">Requests</span>
                  {pendingRequestsCount > 0 && (
                    <span className="badge bg-gradient-to-r from-red-500 to-pink-600 text-white border-none badge-sm indicator-item animate-pulse">
                      {pendingRequestsCount > 9 ? '9+' : pendingRequestsCount}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </div>

          <div className="navbar-end">
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-bold text-white">Welcome back!</div>
                <div className="text-xs opacity-70 font-medium">{user.firstName}</div>
              </div>
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={toggleDropdown}
                  className="group relative w-12 h-12 rounded-full ring-2 ring-cyan-400/60 ring-offset-2 ring-offset-slate-900 hover:ring-cyan-400 transition-all duration-300 hover:scale-110 cursor-pointer bg-gradient-to-br from-slate-700 to-slate-800 border-none outline-none focus:outline-none shadow-lg hover:shadow-cyan-400/20"
                >
                  <img 
                    alt="Profile menu" 
                    src={user.photoUrl || "https://via.placeholder.com/48x48?text=👤"} 
                    className="w-full h-full object-cover rounded-full pointer-events-none group-hover:brightness-110 transition-all duration-300"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse"></div>
                </button>
                
                {showDropdown && createPortal(
                  <div 
                    ref={dropdownMenuRef}
                    className="fixed top-20 right-4 w-56 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden z-[9999]"
                  >
                    <div className="p-4 border-b border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full ring-2 ring-cyan-400/60">
                          <img 
                            src={user.photoUrl || "https://via.placeholder.com/40x40?text=👤"} 
                            alt="Profile"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-white text-sm">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-xs text-slate-400">Developer</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <button 
                        onClick={handleProfileClick}
                        className="flex items-center gap-3 px-4 py-3 text-white hover:bg-slate-700/50 transition-all duration-200 w-full text-left border-none bg-transparent cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                          </svg>
                        </div>
                        <span className="font-medium">My Profile</span>
                      </button>
                      
                      <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-white hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full text-left border-none bg-transparent cursor-pointer"
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"/>
                          </svg>
                        </div>
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>,
                  document.body
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NavBar;