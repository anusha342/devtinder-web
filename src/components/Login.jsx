import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { addNotification } from "../utils/notificationSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuth = async () => {
    setIsLoading(true);
    setError(""); // Clear previous errors
    
    const endpoint = isLoginForm ? "/login" : "/signup";
    const payload = isLoginForm 
      ? { emailId, password } 
      : { firstName, lastName, emailId, password };

    try {
      const res = await axios.post(
        BASE_URL + endpoint,
        payload,
        { withCredentials: true }
      );
      
      if (isLoginForm) {
        dispatch(addUser(res.data));
        dispatch(addNotification({
          message: "Successfully logged in! Welcome back.",
          type: "success",
          duration: 3000
        }));
        navigate("/feed");
      } else {
        // For signup, we don't get user data back, just a success message
        dispatch(addNotification({
          message: "Account created successfully! Please log in.",
          type: "success",
          duration: 3000
        }));
        setIsLoginForm(true); // Switch to login form after successful signup
      }
    } catch (err) {
      setError(err?.response?.data || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAuth();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden px-4">
      {/* Code-like background elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 text-cyan-400 font-mono text-sm max-w-xs">
          const developer = &#123;<br/>
          &nbsp;&nbsp;name: '{firstName || 'coder'}',<br/>
          &nbsp;&nbsp;status: 'learning',<br/>
          &nbsp;&nbsp;coffee: true<br/>
          &#125;;
        </div>
        <div className="absolute bottom-20 right-10 text-purple-400 font-mono text-sm">
          async function connect() &#123;<br/>
          &nbsp;&nbsp;await world.discover();<br/>
          &nbsp;&nbsp;return newNetwork;<br/>
          &#125;
        </div>
      </div>

      {/* Animated blob backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Brand logo hovering next to card (visible on larger screens) */}
      <div className="hidden lg:flex flex-col items-start justify-center mr-16 max-w-md z-10 animate-fade-in-left">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl mb-6 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zm0 2.828l7.172 3.586L12 12l-7.172-3.586L12 4.828zM2 12l10 5 10-5v5l-10 5-10-5v-5z" />
          </svg>
        </div>
        <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-4 font-mono tracking-tight drop-shadow-sm">
          &lt;DevTinder/&gt;
        </h1>
        <p className="text-xl text-slate-300 font-medium leading-relaxed">
          Connect with developers around the world. Share ideas, collaborate on projects, and build your network.
        </p>
      </div>

      {/* Main Card */}
      <div className="card w-full max-w-md bg-slate-800/80 backdrop-blur-xl shadow-2xl border border-slate-700/50 z-10 transform transition-all duration-300 hover:shadow-cyan-500/10">
        <div className="card-body p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">
              {isLoginForm ? "Welcome Back" : "Join the Network"}
            </h2>
            <p className="text-slate-400 font-medium">
              {isLoginForm ? "Log in to discover amazing developers" : "Create an account to start connecting"}
            </p>
          </div>

          <div className="space-y-5">
            {!isLoginForm && (
              <div className="flex gap-4">
                <div className="form-control w-1/2">
                  <label className="label py-1">
                    <span className="label-text text-slate-300 font-bold text-xs uppercase tracking-wider">First Name</span>
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    placeholder="John"
                    className="input bg-slate-700/50 border-slate-600 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 input-field"
                    onChange={(e) => setFirstName(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
                <div className="form-control w-1/2">
                  <label className="label py-1">
                    <span className="label-text text-slate-300 font-bold text-xs uppercase tracking-wider">Last Name</span>
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    placeholder="Doe"
                    className="input bg-slate-700/50 border-slate-600 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 input-field"
                    onChange={(e) => setLastName(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </div>
              </div>
            )}
            
            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-slate-300 font-bold text-xs uppercase tracking-wider">Email Address</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={emailId}
                  placeholder="developer@example.com"
                  className="input bg-slate-700/50 border-slate-600 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 input-field w-full pl-10"
                  onChange={(e) => setEmailId(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text text-slate-300 font-bold text-xs uppercase tracking-wider">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  placeholder="••••••••"
                  className="input bg-slate-700/50 border-slate-600 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all duration-300 input-field w-full pl-10"
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
            </div>

            {error && (
              <div className="alert alert-error bg-error/20 border-error/50 text-error-content shadow-lg py-3">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
            
            <div className="card-actions justify-center mt-6">
              <button 
                className={`btn w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 border-none text-white font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 hover:scale-[1.02] ${isLoading ? 'opacity-70 cursor-not-allowed' : 'btn-pulse'}`}
                onClick={handleAuth}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    {isLoginForm ? 'Authenticating...' : 'Creating...'}
                  </>
                ) : (
                  isLoginForm ? "Login" : "Sign Up"
                )}
              </button>
            </div>
            
            <div className="divider before:bg-slate-700 after:bg-slate-700 text-slate-400 text-sm">OR</div>
            
            <div className="text-center">
              <button 
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors cursor-pointer inline-block"
                onClick={() => {
                  setIsLoginForm(!isLoginForm);
                  setError(""); // Clear error when switching modes
                }}
              >
                {isLoginForm 
                  ? "New to DevTinder? Create an account" 
                  : "Already a member? Log in here"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;