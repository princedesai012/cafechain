import { useState } from 'react';
import { useAppContext } from '../../store/AppContext';
import { toast } from 'react-hot-toast';

function RedemptionPage() {
  const { state, dispatch } = useAppContext();
  const { pendingOtp } = state;
  
  const [otpInput, setOtpInput] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [rewardType, setRewardType] = useState('free_coffee');
  const [isVerifying, setIsVerifying] = useState(false);

  // Generate a new OTP
  const handleGenerateOtp = (e) => {
    e.preventDefault();
    
    if (!customerPhone) {
      toast.error('Please enter customer phone number');
      return;
    }
    
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Dispatch action to store OTP in context
    dispatch({
      type: 'GENERATE_OTP',
      payload: {
        otp,
        customerPhone,
        rewardType,
        timestamp: new Date().toISOString()
      }
    });
    
    toast.success(`OTP generated: ${otp}`);
  };

  // Verify entered OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    
    // Simulate API verification delay
    setTimeout(() => {
      if (!pendingOtp) {
        toast.error('No pending OTP found. Please generate a new one.');
        setIsVerifying(false);
        return;
      }
      
      // ✅ FIXED: use pendingOtp.otp instead of pendingOtp.code
      if (otpInput === pendingOtp.otp) {
        // Create a new transaction record
        const transaction = {
          id: `txn-${Date.now()}`,
          type: 'redemption',
          customerPhone: pendingOtp.customerPhone,
          rewardType: pendingOtp.rewardType,
          timestamp: new Date().toISOString(),
          status: 'completed'
        };
        
        // Dispatch action to verify OTP and record transaction
        dispatch({
          type: 'VERIFY_OTP',
          payload: { transaction }
        });
        
        toast.success('Redemption successful!');
        setOtpInput('');
        setCustomerPhone('');
        setRewardType('free_coffee');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
      
      setIsVerifying(false);
    }, 1000);
  };

  // Clear pending OTP
  const handleClearOtp = () => {
    dispatch({ type: 'CLEAR_OTP' });
    toast.success('OTP cleared');
    setOtpInput('');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Reward Redemption</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Generate OTP Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Generate OTP</h2>
          <form onSubmit={handleGenerateOtp}>
            <div className="mb-4">
              <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Customer Phone
              </label>
              <input
                type="tel"
                id="customerPhone"
                className="input"
                placeholder="Enter customer phone"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="rewardType" className="block text-sm font-medium text-gray-700 mb-1">
                Reward Type
              </label>
              <select
                id="rewardType"
                className="input"
                value={rewardType}
                onChange={(e) => setRewardType(e.target.value)}
              >
                <option value="free_coffee">Free Coffee</option>
                <option value="discount_10">10% Discount</option>
                <option value="discount_20">20% Discount</option>
                <option value="free_pastry">Free Pastry</option>
              </select>
            </div>
            
            <div className="flex justify-between">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!!pendingOtp}
              >
                Generate OTP
              </button>
              
              {pendingOtp && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleClearOtp}
                >
                  Clear OTP
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* Verify OTP Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Verify OTP</h2>
          
          {pendingOtp ? (
            <div>
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">
                  <span className="font-medium">Active OTP:</span> {pendingOtp.otp}
                </p>
                <p className="text-sm text-green-800 mt-1">
                  <span className="font-medium">Customer:</span> {pendingOtp.customerPhone}
                </p>
                <p className="text-sm text-green-800 mt-1">
                  <span className="font-medium">Reward:</span> {pendingOtp.rewardType.replace('_', ' ')}
                </p>
                <p className="text-xs text-green-600 mt-2">
                  Generated at: {new Date(pendingOtp.timestamp).toLocaleTimeString()}
                </p>
              </div>
              
              <form onSubmit={handleVerifyOtp}>
                <div className="mb-6">
                  <label htmlFor="otpInput" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    id="otpInput"
                    className="input text-center text-2xl tracking-widest"
                    placeholder="Enter 6-digit OTP"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    maxLength={6}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isVerifying || otpInput.length !== 6}
                >
                  {isVerifying ? 'Verifying...' : 'Verify & Complete Redemption'}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="mt-4 text-gray-500">No active OTP. Generate one to proceed with redemption.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Redemptions */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Redemptions</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reward</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {state.transactions
                .filter(t => t.type === 'redemption')
                .slice(0, 5)
                .map((transaction, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.customerPhone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.rewardType.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
                
              {state.transactions.filter(t => t.type === 'redemption').length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-sm text-center text-gray-500">
                    No redemption records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}  

export default RedemptionPage;
