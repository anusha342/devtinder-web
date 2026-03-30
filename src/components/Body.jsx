import { Outlet, useNavigate, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import NotificationContainer from "./NotificationContainer";
import HelpModal from "./HelpModal";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect, useState } from "react";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((store) => store.user);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    // If we already have user data, no need to fetch again
    if (userData) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
        timeout: 10000,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      dispatch(addUser(res.data));
      setIsLoading(false);
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Auth error:", err.message);
      setIsLoading(false);

      // Always redirect to login if not authenticated
      if (location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
    }
  };

  useEffect(() => {
    // Only fetch user if we're not on the login page and don't have user data
    if (location.pathname !== "/login" && !userData) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [location.pathname, userData]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-cyan-400 mb-4"></div>
          <p className="text-slate-300 text-xl font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {userData && <NavBar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {userData && <Footer />}
      <NotificationContainer />
      {userData && <HelpModal />}
    </div>
  );
};
export default Body;