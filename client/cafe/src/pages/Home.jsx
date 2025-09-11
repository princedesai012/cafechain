import { Link } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import LeaderboardWidget from '../components/LeaderboardWidget';

function Home() {
  const { state } = useAppContext();
  const { isAuthenticated, setupCompleted, cafeInfo, announcements, partnerCafes } = state;

  // If not authenticated, show landing page
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl" tabIndex="0">
            <span className="block">Welcome to</span>
            <span className="block text-primary">CafeChain</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Connect your cafe to our network and grow your business with our loyalty program.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow w-full sm:w-auto">
              <Link
                to="/auth/register"
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10"
                aria-label="Register for CafeChain"
              >
                Get started
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 w-full sm:w-auto">
              <Link
                to="/auth/login"
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                aria-label="Sign in to CafeChain"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated but setup not completed, show setup CTA
  if (isAuthenticated && !setupCompleted) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Complete Your Setup
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
            You're almost there! Complete your cafe profile to get started.
          </p>
          <div className="mt-5 max-w-md mx-auto">
            <Link
              to="/setup"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10"
            >
              Set up your cafe
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated and setup completed, show dashboard home
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Welcome section */}
      <div className="bg-white shadow rounded-lg mb-6 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back, {cafeInfo?.name}!
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Here's what's happening in your cafe network today.
            </p>
          </div>
        </div>
      </div>


      {/* Main content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Announcements */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Announcements
            </h3>
            <div className="space-y-4">
              {announcements.length > 0 ? (
                announcements.map((announcement) => (
                  <div key={announcement.id} className="border-l-4 border-primary pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-base font-medium text-gray-900">{announcement.title}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(announcement.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                    {announcement.priority === 'high' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-2">
                        Important
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No announcements at this time.</p>
              )}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div>
          <LeaderboardWidget />
        </div>

        {/* Partner Cafes */}
        <div className="lg:col-span-3">
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4" tabIndex="0">
              Partner Cafes
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {partnerCafes.map((cafe) => (
                <div key={cafe.id} className="border rounded-lg p-4 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
                  <img 
                    src={cafe.logo} 
                    alt={`${cafe.name} logo`} 
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="mt-3 sm:mt-0 sm:ml-4">
                    <h4 className="text-base font-medium text-gray-900">{cafe.name}</h4>
                    <p className="text-sm text-gray-600">{cafe.address}</p>
                    <div className="flex flex-col sm:flex-row items-center sm:items-center mt-1">
                      <span className="text-xs text-gray-500">
                        Rating: {cafe.rating}/5
                      </span>
                      <span className="hidden sm:block mx-2 text-gray-300">|</span>
                      <span className="text-xs text-gray-500 mt-1 sm:mt-0">
                        Joined: {new Date(cafe.joinedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;