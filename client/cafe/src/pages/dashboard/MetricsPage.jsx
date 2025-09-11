import { useAppContext } from '../../store/AppContext';

// Dummy metrics data as fallback if context is missing or incomplete
const dummyMetrics = {
  daily: {
    sales: 250.75,
    transactions: 32,
    redemptions: 5,
    newCustomers: 7,
    pointsIssued: 1200,
    pointsRedeemed: 300,
  },
  weekly: {
    sales: 1750.50,
    transactions: 210,
    redemptions: 32,
    newCustomers: 45,
  },
  monthly: {
    sales: 7200.00,
    transactions: 900,
    redemptions: 120,
    newCustomers: 180,
    returningCustomerRate: 62,
    redemptionRate: 25,
  },
  chartData: {
    dailySales: [
      { label: 'Mon', value: 200 },
      { label: 'Tue', value: 220 },
      { label: 'Wed', value: 180 },
      { label: 'Thu', value: 250 },
      { label: 'Fri', value: 300 },
      { label: 'Sat', value: 350 },
      { label: 'Sun', value: 400 },
    ],
  },
  topProducts: [
    { name: 'Cappuccino', unitsSold: 120, revenue: 480, percentageOfSales: 18 },
    { name: 'Latte', unitsSold: 100, revenue: 400, percentageOfSales: 15 },
    { name: 'Espresso', unitsSold: 80, revenue: 320, percentageOfSales: 12 },
    { name: 'Croissant', unitsSold: 60, revenue: 180, percentageOfSales: 8 },
  ],
};

function MetricsPage() {
  const { state } = useAppContext();

  // Use dummy data if metrics is missing or incomplete
  const metrics = state?.metrics && Object.keys(state.metrics).length > 0 ? state.metrics : dummyMetrics;

  // Defensive checks for all metrics fields
  const daily = metrics.daily || dummyMetrics.daily;
  const weekly = metrics.weekly || dummyMetrics.weekly;
  const monthly = metrics.monthly || dummyMetrics.monthly;
  const chartData = metrics.chartData || dummyMetrics.chartData;
  const topProducts = Array.isArray(metrics.topProducts) ? metrics.topProducts : dummyMetrics.topProducts;

  // Helper function to render chart bars for sales trend
  const renderChartBars = (data) => {
    if (!Array.isArray(data) || data.length === 0) return <p>No chart data available.</p>;
    const maxValue = Math.max(...data.map(item => item.value));
    return (
      <div className="flex items-end justify-between h-40 mt-4 space-x-2">
        {data.map((item, index) => {
          const heightPercentage = maxValue ? (item.value / maxValue) * 100 : 0;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-primary rounded-t" 
                style={{ height: `${heightPercentage}%` }}
              ></div>
              <span className="text-xs mt-1">{item.label}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Business Metrics</h1>
      
      {/* Time Period Metrics: Daily, Weekly, Monthly */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Daily Metrics Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Daily</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Sales */}
            <div>
              <p className="text-sm text-gray-500">Sales</p>
              <p className="text-xl font-semibold">${daily.sales?.toFixed(2) ?? '0.00'}</p>
            </div>
            {/* Transactions */}
            <div>
              <p className="text-sm text-gray-500">Transactions</p>
              <p className="text-xl font-semibold">{daily.transactions ?? 0}</p>
            </div>
            {/* Average Order Value */}
            <div>
              <p className="text-sm text-gray-500">Avg. Order</p>
              <p className="text-xl font-semibold">
                {daily.transactions > 0 ? `$${(daily.sales / daily.transactions).toFixed(2)}` : 'N/A'}
              </p>
            </div>
            {/* Redemptions */}
            <div>
              <p className="text-sm text-gray-500">Redemptions</p>
              <p className="text-xl font-semibold">{daily.redemptions ?? 0}</p>
            </div>
          </div>
        </div>

        {/* Weekly Metrics Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Weekly</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Sales */}
            <div>
              <p className="text-sm text-gray-500">Sales</p>
              <p className="text-xl font-semibold">${weekly.sales?.toFixed(2) ?? '0.00'}</p>
            </div>
            {/* Transactions */}
            <div>
              <p className="text-sm text-gray-500">Transactions</p>
              <p className="text-xl font-semibold">{weekly.transactions ?? 0}</p>
            </div>
            {/* Average Order Value */}
            <div>
              <p className="text-sm text-gray-500">Avg. Order</p>
              <p className="text-xl font-semibold">
                {weekly.transactions > 0 ? `$${(weekly.sales / weekly.transactions).toFixed(2)}` : 'N/A'}
              </p>
            </div>
            {/* Redemptions */}
            <div>
              <p className="text-sm text-gray-500">Redemptions</p>
              <p className="text-xl font-semibold">{weekly.redemptions ?? 0}</p>
            </div>
          </div>
        </div>

        {/* Monthly Metrics Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Monthly</h2>
          <div className="grid grid-cols-2 gap-4">
            {/* Sales */}
            <div>
              <p className="text-sm text-gray-500">Sales</p>
              <p className="text-xl font-semibold">${monthly.sales?.toFixed(2) ?? '0.00'}</p>
            </div>
            {/* Transactions */}
            <div>
              <p className="text-sm text-gray-500">Transactions</p>
              <p className="text-xl font-semibold">{monthly.transactions ?? 0}</p>
            </div>
            {/* Average Order Value */}
            <div>
              <p className="text-sm text-gray-500">Avg. Order</p>
              <p className="text-xl font-semibold">
                {monthly.transactions > 0 ? `$${(monthly.sales / monthly.transactions).toFixed(2)}` : 'N/A'}
              </p>
            </div>
            {/* Redemptions */}
            <div>
              <p className="text-sm text-gray-500">Redemptions</p>
              <p className="text-xl font-semibold">{monthly.redemptions ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Chart */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Sales Trend (Last 7 Days)</h2>
        {/* Render sales chart bars */}
        {chartData && chartData.dailySales ? renderChartBars(chartData.dailySales) : <p>No chart data available.</p>}
      </div>

      {/* Customer Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Customer Acquisition Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Acquisition</h2>
          <div className="space-y-4">
            {/* New Customers Today */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">New Customers (Today)</span>
              <span className="text-sm font-medium">{daily.newCustomers ?? 0}</span>
            </div>
            {/* New Customers This Week */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">New Customers (Week)</span>
              <span className="text-sm font-medium">{weekly.newCustomers ?? 0}</span>
            </div>
            {/* New Customers This Month */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">New Customers (Month)</span>
              <span className="text-sm font-medium">{monthly.newCustomers ?? 0}</span>
            </div>
            {/* Returning Customer Rate */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Returning Customers (%)</span>
              <span className="text-sm font-medium">{monthly.returningCustomerRate ?? 0}%</span>
            </div>
          </div>
        </div>

        {/* Loyalty Program Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Loyalty Program</h2>
          <div className="space-y-4">
            {/* Points Issued Today */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Points Issued (Today)</span>
              <span className="text-sm font-medium">{daily.pointsIssued ?? 0}</span>
            </div>
            {/* Points Redeemed Today */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Points Redeemed (Today)</span>
              <span className="text-sm font-medium">{daily.pointsRedeemed ?? 0}</span>
            </div>
            {/* Redemption Rate */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Redemption Rate</span>
              <span className="text-sm font-medium">{monthly.redemptionRate ?? 0}%</span>
            </div>
            {/* Average Points per Transaction */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Avg. Points per Transaction</span>
              <span className="text-sm font-medium">
                {daily.transactions > 0 ? (daily.pointsIssued / daily.transactions).toFixed(1) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Top Products</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">% of Sales</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Render each product row */}
              {topProducts.map((product, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.unitsSold}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.revenue.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.percentageOfSales}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MetricsPage;