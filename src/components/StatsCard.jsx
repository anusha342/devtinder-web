const StatsCard = ({ icon, title, value, subtitle, color = "purple" }) => {
  const colorClasses = {
    purple: "from-purple-500 to-purple-600",
    blue: "from-blue-500 to-blue-600", 
    green: "from-green-500 to-green-600",
    pink: "from-pink-500 to-pink-600",
    orange: "from-orange-500 to-orange-600"
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 card-hover">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-xl flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">{value}</div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
      </div>
      {subtitle && (
        <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default StatsCard;