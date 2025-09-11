import { useAppContext } from '../../store/AppContext';

function LeaderboardPage() {
  const { state } = useAppContext();
  const { leaderboard, cafeInfo } = state;

  // Find current cafe's rank
  const currentCafeRank = leaderboard.findIndex(cafe => cafe.id === cafeInfo?.id) + 1;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">CafeChain Leaderboard</h1>
      
      {/* Current Rank Summary */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center justify-center p-4 bg-primary/5 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Your Current Rank</p>
            <p className="text-4xl font-bold text-primary mt-2">
              {currentCafeRank ? `#${currentCafeRank}` : 'N/A'}
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-secondary/5 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Your Points</p>
            <p className="text-4xl font-bold text-secondary mt-2">
              {cafeInfo ? leaderboard.find(cafe => cafe.id === cafeInfo.id)?.points : 0}
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 bg-accent/5 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Points to Next Rank</p>
            <p className="text-4xl font-bold text-accent mt-2">
              {currentCafeRank > 1 ? 
                leaderboard[currentCafeRank - 2].points - leaderboard[currentCafeRank - 1].points : 
                'Top Rank!'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Full Leaderboard */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Full Leaderboard</h2>
          <p className="text-sm text-gray-500 mt-1">Updated daily based on customer engagement and sales</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cafe</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Week</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboard.map((cafe, index) => (
                <tr 
                  key={cafe.id} 
                  className={cafe.id === cafeInfo?.id ? 'bg-primary/5' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full" src={cafe.logo || 'https://placehold.co/100x100?text=Cafe'} alt="" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{cafe.name}</div>
                        <div className="text-sm text-gray-500">{cafe.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cafe.points}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {cafe.trend === 'up' ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        Up
                      </span>
                    ) : cafe.trend === 'down' ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Down
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
                        </svg>
                        Same
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{cafe.lastWeekRank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* How Points are Calculated */}
      <div className="bg-white shadow rounded-lg p-6 mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">How Points are Calculated</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-2">Point Sources</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li className="text-sm text-gray-600">Customer transactions: 1 point per $1 spent</li>
              <li className="text-sm text-gray-600">New customer registrations: 50 points each</li>
              <li className="text-sm text-gray-600">Customer retention: 10 points per returning customer</li>
              <li className="text-sm text-gray-600">Event participation: 100 points per event</li>
              <li className="text-sm text-gray-600">Social media engagement: Up to 200 points monthly</li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-2">Rewards</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li className="text-sm text-gray-600">Top 3 cafes: Featured on CafeChain homepage</li>
              <li className="text-sm text-gray-600">Top 10 cafes: Premium marketing package</li>
              <li className="text-sm text-gray-600">Top 25 cafes: Reduced platform fees</li>
              <li className="text-sm text-gray-600">All participants: Monthly performance insights</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardPage;