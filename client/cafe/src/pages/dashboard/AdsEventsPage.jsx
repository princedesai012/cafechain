import { useState } from 'react';
import { useAppContext } from '../../store/AppContext';

function AdsEventsPage() {
  const { state } = useAppContext();
  const { events } = state;
  const [activeTab, setActiveTab] = useState('ads'); // 'ads' or 'events'
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'in-store',
  });

  // Filter events by type
  const networkAds = events.filter(event => event.type === 'network');
  const cafeEvents = events.filter(event => event.type === 'cafe');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would dispatch an action to add the event
    alert('Event creation would be saved in a real app!');
    setShowEventForm(false);
    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      type: 'in-store',
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Ads & Events</h1>
        
        {/* Tab Navigation */}
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('ads')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'ads' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
          >
            Network Ads
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === 'events' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
          >
            Cafe Events
          </button>
        </div>
      </div>

      {/* Network Ads Section */}
      {activeTab === 'ads' && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Current Network Promotions</h2>
              <p className="text-sm text-gray-500 mt-1">These ads are running across the CafeChain network</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {networkAds.length > 0 ? (
                networkAds.map((ad) => (
                  <div key={ad.id} className="p-6">
                    <div className="flex items-start">
                      {ad.image && (
                        <div className="flex-shrink-0 mr-4">
                          <img src={ad.image} alt={ad.title} className="h-24 w-24 object-cover rounded-md" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{ad.title}</h3>
                        <p className="mt-1 text-sm text-gray-600">{ad.description}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                            Active
                          </span>
                          <span>Until {new Date(ad.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-4">
                          <a 
                            href={`https://wa.me/?text=Check out this promotion at CafeChain: ${ad.title}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                          >
                            Share via WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No active network promotions at the moment.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Benefits of Network Ads</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-primary/5 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Wider Reach</h3>
                <p className="text-sm text-gray-600">Your promotions reach customers across all partner cafes in the network.</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Cross-Promotion</h3>
                <p className="text-sm text-gray-600">Benefit from cross-cafe customer traffic and shared marketing efforts.</p>
              </div>
              <div className="p-4 bg-primary/5 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Analytics</h3>
                <p className="text-sm text-gray-600">Get detailed insights on how your promotions perform across different locations.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      Cafe Events Section
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Your Cafe Events</h2>

          </div>



          {/* Events List */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Upcoming & Active Events</h2>
              <p className="text-sm text-gray-500 mt-1">Events hosted by your cafe</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {cafeEvents.length > 0 ? (
                cafeEvents.map((event) => (
                  <div key={event.id} className="p-6">
                    <div className="flex items-start">
                      {event.image && (
                        <div className="flex-shrink-0 mr-4">
                          <img src={event.image} alt={event.title} className="h-24 w-24 object-cover rounded-md" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {event.type}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                        </div>
                        <div className="mt-4 flex space-x-3">
                          <a 
                            href={`https://wa.me/?text=Join me at ${event.title} on ${new Date(event.date).toLocaleDateString()} at ${event.time}!`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            Share via WhatsApp
                          </a>
                          <button 
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Edit Event
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  No events scheduled. Create your first event to engage with customers!
                </div>
              )}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Event Best Practices</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Effective Event Types</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li className="text-sm text-gray-600">Coffee tasting sessions</li>
                  <li className="text-sm text-gray-600">Barista workshops</li>
                  <li className="text-sm text-gray-600">Live music nights</li>
                  <li className="text-sm text-gray-600">Book clubs & discussion groups</li>
                  <li className="text-sm text-gray-600">Seasonal promotions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Promotion Tips</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li className="text-sm text-gray-600">Share events 2-3 weeks in advance</li>
                  <li className="text-sm text-gray-600">Use WhatsApp and social media</li>
                  <li className="text-sm text-gray-600">Offer early-bird incentives</li>
                  <li className="text-sm text-gray-600">Partner with local businesses</li>
                  <li className="text-sm text-gray-600">Follow up with attendees after events</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdsEventsPage;