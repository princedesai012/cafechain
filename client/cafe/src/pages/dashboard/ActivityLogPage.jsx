import { useState } from 'react';
import { useAppContext } from '../../store/AppContext';

function ActivityLogPage() {
  const { state } = useAppContext();
  // Use fallback empty array if transactions is undefined
  const transactions = Array.isArray(state.transactions) ? state.transactions : [];

  const [timeFilter, setTimeFilter] = useState('today'); // 'today', 'week', 'month', 'all'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'points', 'redemption', 'otp'

  // Get current date for filtering
  const currentDate = new Date();
  const today = new Date(currentDate.setHours(0, 0, 0, 0));
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);

  // Filter transactions based on selected filters
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);

    // Apply time filter
    if (timeFilter === 'today' && transactionDate < today) {
      return false;
    }
    if (timeFilter === 'week' && transactionDate < oneWeekAgo) {
      return false;
    }
    if (timeFilter === 'month' && transactionDate < oneMonthAgo) {
      return false;
    }

    // Apply type filter
    if (typeFilter !== 'all' && transaction.type !== typeFilter) {
      return false;
    }

    return true;
  });

  // Sort transactions by date (newest first)
  const sortedTransactions = filteredTransactions.length > 0
    ? [...filteredTransactions].sort((a, b) => new Date(b.date) - new Date(a.date))
    : [];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Activity Log</h1>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Filters</h2>
            <p className="text-sm text-gray-500">View your cafe's transaction history</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div>
              <label htmlFor="timeFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Time Period
              </label>
              <select
                id="timeFilter"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div>
              <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Transaction Type
              </label>
              <select
                id="typeFilter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="all">All Types</option>
                <option value="points">Points Earned</option>
                <option value="redemption">Redemptions</option>
                <option value="otp">OTP Verifications</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing {sortedTransactions.length} {sortedTransactions.length === 1 ? 'transaction' : 'transactions'}
            {timeFilter !== 'all' && ` from ${timeFilter === 'today' ? 'today' : timeFilter === 'week' ? 'this week' : 'this month'}`}
          </p>
        </div>
        {sortedTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()} {transaction.time ? `at ${transaction.time}` : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          {transaction.customer?.name ? transaction.customer.name.charAt(0) : '?'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{transaction.customer?.name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">{transaction.customer?.phone || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.type === 'points'
                          ? 'bg-green-100 text-green-800'
                          : transaction.type === 'redemption'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.type === 'points'
                          ? 'Points Earned'
                          : transaction.type === 'redemption'
                          ? 'Redemption'
                          : 'OTP Verification'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.type === 'points' ? (
                        <span className="text-green-600">+{transaction.amount} points</span>
                      ) : transaction.type === 'redemption' ? (
                        <span className="text-blue-600">-{transaction.amount} points</span>
                      ) : (
                        <span>N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status
                          ? transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)
                          : 'Unknown'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2">No transactions found for the selected filters.</p>
            <p className="mt-1">Try changing your filters to see more results.</p>
          </div>
        )}
      </div>

      {/* Activity Summary */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Points Summary</h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Points Earned</dt>
              <dd className="mt-1 text-3xl font-semibold text-green-600">
                {transactions
                  .filter(t => t.type === 'points' && t.status === 'completed')
                  .reduce((sum, t) => sum + (t.amount || 0), 0)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Points Redeemed</dt>
              <dd className="mt-1 text-3xl font-semibold text-blue-600">
                {transactions
                  .filter(t => t.type === 'redemption' && t.status === 'completed')
                  .reduce((sum, t) => sum + (t.amount || 0), 0)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Activity</h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Unique Customers</dt>
              <dd className="mt-1 text-3xl font-semibold text-primary">
                {new Set(transactions.map(t => t.customer?.id).filter(Boolean)).size}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Repeat Customers</dt>
              <dd className="mt-1 text-3xl font-semibold text-primary">
                {(() => {
                  const customerCounts = transactions.reduce((acc, t) => {
                    if (t.customer?.id) {
                      acc[t.customer.id] = (acc[t.customer.id] || 0) + 1;
                    }
                    return acc;
                  }, {});
                  return Object.values(customerCounts).filter(count => count > 1).length;
                })()}
              </dd>
            </div>
          </dl>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Breakdown</h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Points Transactions</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {transactions.filter(t => t.type === 'points').length}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Redemption Transactions</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {transactions.filter(t => t.type === 'redemption').length}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

export default ActivityLogPage;