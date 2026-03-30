import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import LoadingSkeleton from "./LoadingSkeleton";
import ConnectionCard from "./ConnectionCard";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [filterBy, setFilterBy] = useState("all");

  const fetchConnections = async () => {
    if (connections) return;
    
    setIsLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
        timeout: 8000,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      dispatch(addConnections(res.data.data));
    } catch (err) {
      clearTimeout(timeoutId);
      console.error("Connections error:", err.message);
      dispatch(addConnections([]));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const filteredConnections = connections?.filter(connection => {
    const matchesSearch = `${connection.firstName} ${connection.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === "all") return matchesSearch;
    if (filterBy === "developers") return matchesSearch && (connection.about?.toLowerCase().includes('developer') || connection.about?.toLowerCase().includes('engineer'));
    if (filterBy === "recent") return matchesSearch;
    
    return matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl">
              <svg className="w-8 h-8 text-white animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2 font-mono">
              &lt;Network/&gt;
            </h1>
            <p className="text-slate-300 text-lg font-medium">Loading your amazing connections...</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} type="card" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!connections) return <div className="flex justify-center my-10">Loading connections...</div>;

  if (connections.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="text-center max-w-md mx-auto p-8 relative z-10">
          <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 mx-auto shadow-2xl transform hover:scale-105 transition-all duration-300">
            <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
            </svg>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-4 font-mono">
            &lt;NoConnections/&gt;
          </h1>
          <p className="text-slate-300 text-lg mb-8 font-medium">
            Start swiping on profiles to make your first amazing connections
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
      {/* Code-like background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-cyan-400 font-mono text-xs">
          const connections = [<br/>
          &nbsp;&nbsp;&#123; name: "Alice", skill: "React" &#125;,<br/>
          &nbsp;&nbsp;&#123; name: "Bob", skill: "Node.js" &#125;<br/>
          ];
        </div>
        <div className="absolute bottom-20 right-10 text-emerald-400 font-mono text-xs">
          network.map(dev =&gt; <br/>
          &nbsp;&nbsp;connect(dev)<br/>
          );
        </div>
        <div className="absolute top-1/2 left-10 text-purple-400 font-mono text-xs">
          // Building connections...<br/>
          for (let dev of developers) &#123;<br/>
          &nbsp;&nbsp;if (dev.awesome) &#123;<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;connect(dev);<br/>
          &nbsp;&nbsp;&#125;<br/>
          &#125;
        </div>
      </div>

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
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
            </svg>
          </div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 font-mono">
            &lt;Network/&gt;
          </h1>
          <p className="text-slate-300 text-xl font-medium">Amazing people you've connected with</p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
          <div className="stats shadow-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl">
            <div className="stat place-items-center p-6">
              <div className="stat-value text-2xl font-black bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                {connections.length}
              </div>
              <div className="stat-desc font-semibold text-slate-400">Total Connections</div>
            </div>
          </div>
          
          <div className="stats shadow-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl">
            <div className="stat place-items-center p-6">
              <div className="stat-value text-2xl font-black bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {filteredConnections.length}
              </div>
              <div className="stat-desc font-semibold text-slate-400">Showing</div>
            </div>
          </div>
          
          <div className="stats shadow-2xl bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl">
            <div className="stat place-items-center p-6">
              <div className="stat-value text-2xl font-black bg-gradient-to-r from-emerald-500 to-cyan-600 bg-clip-text text-transparent">
                {connections.filter(c => c.about?.toLowerCase().includes('developer') || c.about?.toLowerCase().includes('engineer')).length}
              </div>
              <div className="stat-desc font-semibold text-slate-400">Developers</div>
            </div>
          </div>
          

        </div>

        {/* Search and Filter Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="card bg-slate-800/80 backdrop-blur-xl shadow-2xl border border-slate-700/50">
            <div className="card-body p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search your connections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered w-full bg-slate-700/50 backdrop-blur-sm border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 pl-12 text-white placeholder-slate-400"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"/>
                    </svg>
                  </div>
                </div>
                
                {/* Filter Dropdown */}
                <div className="relative">
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="select select-bordered bg-slate-700/50 backdrop-blur-sm border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-200 text-white min-w-[150px]"
                  >
                    <option value="all">All Connections</option>
                    <option value="developers">Developers</option>
                    <option value="recent">Recent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Connections Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {filteredConnections.map((connection, index) => (
            <div 
              key={connection._id} 
              className="transform hover:scale-105 transition-all duration-300"
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              <ConnectionCard connection={connection} />
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="text-center mt-16">
          <div className="stats shadow-2xl bg-gradient-to-r from-slate-800/80 to-slate-700/60 backdrop-blur-xl border border-slate-600/30 rounded-2xl">
            <div className="stat place-items-center p-8">
              <div className="stat-value text-4xl font-black bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent">
                {connections.length}
              </div>
              <div className="stat-desc font-bold text-slate-300 text-lg">Total Network Size</div>
            </div>
            <div className="stat place-items-center p-8">
              <div className="stat-value text-4xl font-black bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent">
                {filteredConnections.length}
              </div>
              <div className="stat-desc font-bold text-slate-300 text-lg">Currently Showing</div>
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
export default Connections;