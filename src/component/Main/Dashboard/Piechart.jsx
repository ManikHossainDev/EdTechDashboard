const Piechart = () => {
  // Chart data matching the image
  const totalChildren = 369;
  const totalContent = 75; // percentage
  const lightSegment = 40; // percentage
  const darkSegment = 60; // percentage

  // SVG circle properties
  const radius = 70;
  const strokeWidth = 40;
  const circumference = 2 * Math.PI * radius;
  const centerX = 100;
  const centerY = 100;

  // Calculate stroke dash arrays
  const lightSegmentLength = (circumference * lightSegment) / 100;
  const darkSegmentLength = (circumference * darkSegment) / 100;

  return (
    <div className="flex items-center justify-center ">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full ">
        <div className="flex justify-around items-center mb-1">
           {/* Left side - Total Children */}
          <div className="">
            <div className="text-xs text-gray-500 font-medium mb-1">Total Children</div>
            <div className="text-4xl font-bold text-gray-900">{totalChildren}</div>
          </div>
          {/* Right side - Total Content */}
          <div className="">
            <div className="flex items-center justify-end mb-1">
              <div className="w-2 h-2 rounded-full bg-orange-400 mr-2"></div>
              <div className="text-xs text-gray-500 font-medium">Total Content</div>
            </div>
            <div className="text-4xl font-bold text-gray-900">{totalContent}%</div>
          </div>
        </div>
        {/* Main content container */}
        <div className="flex items-center justify-center">
          

          {/* Center - Donut Chart */}
          <div className="relative">
            <svg width="270" height="270" viewBox="0 0 200 200" className="transform -rotate-90">
              {/* Light segment (40%) */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                stroke="#FCD9B8"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${lightSegmentLength} ${circumference}`}
                strokeDashoffset={0}
              />
              {/* Dark segment (60%) */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                stroke="#F59E42"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${darkSegmentLength} ${circumference}`}
                strokeDashoffset={-lightSegmentLength}
              />
            </svg>
            
            {/* Percentage labels */}
            <div className="absolute top-1/4 left-1/4 text-sm font-semibold text-gray-700">
              40%
            </div>
            <div className="absolute bottom-1/3 right-1/4 text-sm font-semibold text-gray-700">
              60%
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default Piechart;