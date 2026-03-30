import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((store) => store.user);
  
  // Show loading state while user data is being fetched
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-cyan-400 mb-4"></div>
          <p className="text-slate-300 text-xl font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <EditProfile user={user} />
    </div>
  );
};
export default Profile;