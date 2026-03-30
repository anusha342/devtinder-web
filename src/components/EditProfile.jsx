import { useState } from "react";
import ProfilePreviewCard from "./ProfilePreviewCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { addNotification } from "../utils/notificationSlice";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(user.skills ? user.skills.join(", ") : "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const isValidUrl = (string) => {
    if (!string) return true;
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const saveProfile = async () => {
    setError("");
    setIsLoading(true);  

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name are required");
      setIsLoading(false);
      return;
    }

    if (photoUrl.trim() && !isValidUrl(photoUrl.trim())) {
      setError("Please enter a valid URL format");
      setIsLoading(false);
      return;
    }

    if (age && (isNaN(age) || age < 1 || age > 150)) {
      setError("Please enter a valid age");
      setIsLoading(false);
      return;
    }

    const profileData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      photoUrl: photoUrl.trim(),
      age: age ? parseInt(age) : undefined,
      gender: gender.trim(),
      about: about.trim(),
      skills: skills.trim() ? skills.split(",").map(skill => skill.trim()).filter(skill => skill) : [],
    };

    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        profileData,
        { withCredentials: true }
      );
      dispatch(addUser(res?.data?.data));
      
      dispatch(addNotification({
        message: "Profile updated successfully! Your changes are now live.",
        type: 'success',
        duration: 4000
      }));
    } catch (err) {
      console.error("Profile update error:", err);
      let errorMessage = "Failed to update profile. Please try again.";
      
      if (err.response?.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      }
      
      setError(errorMessage);
      
      dispatch(addNotification({
        message: `${errorMessage}`,
        type: 'error',
        duration: 5000
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 relative overflow-hidden">
      {/* Code-like background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-40 left-10 text-cyan-400 font-mono text-xs">
          class Developer &#123;<br/>
          &nbsp;&nbsp;constructor(profile) &#123;<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;this.awesome = true;<br/>
          &nbsp;&nbsp;&#125;<br/>
          &#125;
        </div>
        <div className="absolute bottom-40 right-10 text-emerald-400 font-mono text-xs">
          const skills = [<br/>
          &nbsp;&nbsp;"JavaScript", "React",<br/>
          &nbsp;&nbsp;"Node.js", "Python"<br/>
          ];
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-cyan-400/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
              </svg>
            </div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 font-mono">
              &lt;EditProfile/&gt;
            </h1>
            <p className="text-slate-300 text-xl font-medium max-w-2xl mx-auto">
              Craft your developer profile and showcase your skills to the world
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form Section */}
            <div className="card bg-slate-800/80 backdrop-blur-xl shadow-2xl border border-slate-700/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/90 to-slate-900/70 rounded-3xl"></div>
              
              <div className="card-body relative z-10 p-8">
                {/* Profile Photo Section */}
                <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-slate-700/30 to-slate-600/30 rounded-2xl border border-slate-600/50">
                  <div className="avatar">
                    <div className="w-20 h-20 rounded-2xl ring ring-cyan-400 ring-offset-base-100 ring-offset-2">
                      <img 
                        src={photoUrl || "https://via.placeholder.com/80x80?text=Photo"} 
                        alt="Profile" 
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-white mb-1">
                      {firstName || "Your"} {lastName || "Name"}
                    </h2>
                    <p className="text-slate-400 font-medium">Developer Profile</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-emerald-400 text-sm font-medium">Profile Active</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-8">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-bold text-slate-300 text-base">First Name *</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={firstName}
                          className="input input-bordered w-full bg-slate-700/50 backdrop-blur-sm border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 pl-12 text-white placeholder-slate-400"
                          placeholder="First Name"
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-bold text-slate-300 text-base">Last Name *</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={lastName}
                          className="input input-bordered w-full bg-slate-700/50 backdrop-blur-sm border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 pl-12 text-white placeholder-slate-400"
                          placeholder="Last Name"
                          onChange={(e) => setLastName(e.target.value)}
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Photo URL */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold text-slate-300 text-base">Photo URL</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={photoUrl}
                        className="input input-bordered w-full bg-slate-700/50 backdrop-blur-sm border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 pl-12 text-white placeholder-slate-400"
                        placeholder="https://example.com/your-photo.jpg"
                        onChange={(e) => setPhotoUrl(e.target.value)}
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                        </svg>
                      </div>
                    </div>
                    <label className="label">
                      <span className="label-text-alt text-cyan-400 font-medium">Direct image links work best (JPG, PNG, WebP)</span>
                    </label>
                  </div>

                  {/* Skills Section */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold text-slate-300 text-base">Technical Skills</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={skills}
                        className="input input-bordered w-full bg-slate-700/50 backdrop-blur-sm border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 pl-12 text-white placeholder-slate-400"
                        placeholder="JavaScript, React, Node.js, Python, Docker"
                        onChange={(e) => setSkills(e.target.value)}
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                    </div>
                    <label className="label">
                      <span className="label-text-alt text-cyan-400 font-medium">Separate skills with commas (e.g., React, Node.js, Python)</span>
                    </label>
                  </div>

                  {/* Age and Gender */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-bold text-slate-300 text-base">Age</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={age}
                          min="1"
                          max="150"
                          className="input input-bordered w-full bg-slate-700/50 backdrop-blur-sm border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 pl-12 text-white placeholder-slate-400"
                          placeholder="25"
                          onChange={(e) => setAge(e.target.value)}
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-bold text-slate-300 text-base">Gender</span>
                      </label>
                      <div className="relative">
                        <select
                          value={gender}
                          className="select select-bordered w-full bg-slate-700/50 backdrop-blur-sm border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 pl-12 text-white"
                          onChange={(e) => setGender(e.target.value)}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 pointer-events-none">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* About */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold text-slate-300 text-base">About You</span>
                    </label>
                    <div className="relative">
                      <textarea
                        value={about}
                        rows="5"
                        className="textarea textarea-bordered w-full bg-slate-700/50 backdrop-blur-sm border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 resize-none text-white placeholder-slate-400 leading-relaxed"
                        placeholder="Full-stack developer passionate about creating innovative solutions. Love working with modern frameworks and always eager to learn new technologies..."
                        onChange={(e) => setAbout(e.target.value)}
                      />
                    </div>
                    <label className="label">
                      <span className="label-text-alt text-cyan-400 font-medium">Tell your story! ({about.length}/500 characters)</span>
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="alert bg-red-900/50 border-red-500/50 text-red-300 rounded-2xl">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"/>
                      </svg>
                      <span className="font-medium">{error}</span>
                    </div>
                  )}

                  {/* Save Button */}
                  <button
                    onClick={saveProfile}
                    disabled={isLoading}
                    className="btn btn-lg w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 border-none hover:scale-105 transition-all duration-200 shadow-2xl text-white font-bold text-lg h-16"
                  >
                    {isLoading && <span className="loading loading-spinner loading-md"></span>}
                    {isLoading ? "Saving Your Profile..." : "Save Profile"}
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="lg:sticky lg:top-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl mb-3 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-black text-white flex items-center justify-center gap-2">
                  Live Preview
                </h3>
                <p className="text-slate-400 text-lg font-medium">See how your profile looks to others</p>
              </div>
              
              {/* Preview card container */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-400/20 to-blue-400/20 rounded-3xl blur-xl scale-110 opacity-50"></div>
                <div className="relative">
                  <ProfilePreviewCard
                    user={{ 
                      firstName: firstName || "Your", 
                      lastName: lastName || "Name", 
                      photoUrl: photoUrl || "https://via.placeholder.com/400x600?text=Your+Photo", 
                      age: age || "Age", 
                      gender: gender || "Gender", 
                      about: about || "Tell others about yourself...",
                      skills: skills ? skills.split(",").map(skill => skill.trim()).filter(skill => skill) : []
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default EditProfile;