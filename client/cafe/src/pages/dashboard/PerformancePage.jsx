import { useState } from 'react';
import { useAppContext } from '../../store/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function PerformancePage() {
  const { state } = useAppContext();
  const { transactions, performance } = state;
  
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
  
  // Generate dates for the selected time range
  const generateDateLabels = () => {
    const today = new Date();
    const labels = [];
    
    if (timeRange === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      }
    } else if (timeRange === 'month') {
      // Last 30 days, grouped by week
      for (let i = 4; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - (i * 7));
        labels.push(`Week ${5-i}`);
      }
    } else if (timeRange === 'year') {
      // Last 12 months
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today);
        date.setMonth(today.getMonth() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
      }
    }
    
    return labels;
  };
  
  // Use performance data from context or generate dummy data if not available
  const generateChartData = () => {
    const labels = generateDateLabels();
    
    // Points trend data
    let pointsData = [];
    let usersData = [];
    let eventsData = [];
    
    if (performance && performance.pointsTrend) {
      pointsData = performance.pointsTrend;
    } else {
      pointsData = labels.map((label, index) => {
        const baseValue = 100 + (index * 15);
        const randomVariation = Math.floor(Math.random() * 30) - 15;
        return {
          name: label,
          earned: baseValue + randomVariation,
          redeemed: Math.floor((baseValue + randomVariation) * 0.7 * Math.random())
        };
      });
    }
    
    // Active users data
    if (performance && performance.activeUsersTrend) {
      usersData = performance.activeUsersTrend;
    } else {
      usersData = labels.map((label, index) => {
        const baseValue = 20 + (index * 2);
        const randomVariation = Math.floor(Math.random() * 10) - 5;
        return {
          name: label,
          active: baseValue + randomVariation,
          new: Math.floor((baseValue + randomVariation) * 0.3)
        };
      });
    }
    
    // Event participation data
    if (performance && performance.participationTrend) {
      eventsData = performance.participationTrend;
    } else {
      eventsData = labels.map((label, index) => {
        const baseValue = 5 + Math.floor(Math.random() * 10);
        return {
          name: label,
          participants: baseValue
        };
      });
    }
    
    // Customer segments data for pie chart
    const segmentsData = [
      { name: 'Regular', value: 45 },
      { name: 'Occasional', value: 30 },
      { name: 'New', value: 15 },
      { name: 'VIP', value: 10 }
    ];
    
    return { pointsData, usersData, eventsData, segmentsData };
  };
  
  const { pointsData, usersData, eventsData, segmentsData } = generateChartData();
  
  // Colors for charts
  const COLORS = ['#4a3a2f', '#6d5c4d', '#8c7b6b', '#a99b8b', '#c6bab0'];
  
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Performance Analytics</h1>
        
        <div className="mt-4 md:mt-0">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${timeRange === 'week' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-300`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 text-sm font-medium ${timeRange === 'month' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border-t border-b border-gray-300`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('year')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${timeRange === 'year' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} border border-gray-300`}
            >
              Year
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Points Trend Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Points Trend</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pointsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="earned" name="Points Earned" fill="#4a3a2f" />
                <Bar dataKey="redeemed" name="Points Redeemed" fill="#8c7b6b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Points earned vs. redeemed over the selected time period. The trend shows customer engagement with your loyalty program.
          </p>
        </div>
        
        {/* Active Users Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">User Activity</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={usersData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="active" name="Active Users" stroke="#4a3a2f" strokeWidth={2} />
                <Line type="monotone" dataKey="new" name="New Users" stroke="#8c7b6b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Active and new users over time. This helps you understand customer retention and acquisition patterns.
          </p>
        </div>
        
        {/* Event Participation Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Event Participation</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={eventsData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="participants" name="Participants" fill="#6d5c4d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Number of participants in cafe events over time. Higher participation indicates successful event promotion and customer interest.
          </p>
        </div>
        
        {/* Customer Segments Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Segments</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segmentsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {segmentsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Distribution of your customer base by segment. Understanding your customer mix helps with targeted marketing and service improvements.
          </p>
        </div>
      </div>
      
      {/* Performance Summary */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Summary</h2>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Points Metrics</h3>
            <dl className="mt-2 space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Total Points Earned</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {pointsData.reduce((sum, item) => sum + item.earned, 0).toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Total Points Redeemed</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {pointsData.reduce((sum, item) => sum + item.redeemed, 0).toLocaleString()}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Redemption Rate</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {Math.round((pointsData.reduce((sum, item) => sum + item.redeemed, 0) / pointsData.reduce((sum, item) => sum + item.earned, 0)) * 100)}%
                </dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">User Metrics</h3>
            <dl className="mt-2 space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Average Active Users</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {Math.round(usersData.reduce((sum, item) => sum + item.active, 0) / usersData.length)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">New User Growth</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {usersData[usersData.length - 1].new > usersData[0].new ? '+' : ''}
                  {Math.round(((usersData[usersData.length - 1].new - usersData[0].new) / usersData[0].new) * 100)}%
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">User Retention</dt>
                <dd className="text-sm font-medium text-gray-900">76%</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Event Metrics</h3>
            <dl className="mt-2 space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Total Events</dt>
                <dd className="text-sm font-medium text-gray-900">{eventsData.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Avg. Participants</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {Math.round(eventsData.reduce((sum, item) => sum + item.participants, 0) / eventsData.length)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Participation Rate</dt>
                <dd className="text-sm font-medium text-gray-900">32%</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformancePage;