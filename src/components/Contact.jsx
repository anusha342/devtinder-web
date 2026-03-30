import { useState } from "react";
import { useDispatch } from "react-redux";
import { addNotification } from "../utils/notificationSlice";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      dispatch(addNotification({
        message: "Your message has been sent successfully. We'll get back to you soon!",
        type: "success",
        duration: 5000
      }));
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 relative overflow-hidden flex justify-center items-center">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="relative max-w-4xl mx-auto bg-slate-800/80 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/10 overflow-hidden">
          {/* Close Button */}
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-6 right-6 w-10 h-10 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 border border-white/10 transition-all duration-200 text-slate-400 z-50 hover:scale-110"
            title="Go Back"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>

          <div className="grid md:grid-cols-2">
            
            {/* Left Side - Info */}
            <div className="p-10 bg-gradient-to-br from-slate-900/50 to-slate-800/50 flex flex-col justify-center">
              <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                Get in Touch
              </h1>
              <p className="text-slate-300 text-lg mb-8">
                Have questions, suggestions, or just want to say hi? We'd love to hear from you.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold">Email</h3>
                    <p className="text-slate-400">anusharaj1804@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-bold">GitHub</h3>
                    <p className="text-slate-400">@anusha342</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-10">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-slate-300">Your Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-slate-700/50 backdrop-blur-sm border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-400"
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-slate-300">Email Address</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-slate-700/50 backdrop-blur-sm border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-400"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-slate-300">Subject</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-slate-700/50 backdrop-blur-sm border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 text-white placeholder-slate-400"
                    placeholder="How can we help?"
                  />
                </div>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold text-slate-300">Message</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full bg-slate-700/50 backdrop-blur-sm border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 resize-none text-white placeholder-slate-400"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-lg w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 border-none hover:scale-105 transition-all duration-200 shadow-2xl text-white font-bold h-14 mt-4"
                >
                  {isSubmitting ? <span className="loading loading-spinner"></span> : "Send Message"}
                </button>
              </form>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
