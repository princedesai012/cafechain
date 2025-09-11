import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../store/AppContext';
import toast from 'react-hot-toast';

function FirstTimeSetup() {
  const [formData, setFormData] = useState({
    name: '',
    logo: 'https://placehold.co/100x100?text=Cafe',
    address: '',
    phone: '',
    email: '',
    description: '',
    openingHours: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const { dispatch } = useAppContext();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Simple validation
      if (!formData.name || !formData.address || !formData.phone || !formData.email) {
        toast.error('Please fill in all required fields');
        setIsLoading(false);
        return;
      }
      
      // Complete setup
      dispatch({ 
        type: 'COMPLETE_SETUP', 
        payload: {
          ...formData,
          id: `cafe-${Date.now()}`,
          joinedDate: new Date().toISOString(),
          status: 'active'
        } 
      });
      
      toast.success('Setup completed successfully!');
      navigate('/');
    }, 1000);
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Set Up Your Cafe
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Complete your profile to get started with CafeChain
        </p>
      </div>
      
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="name" className="label">
                Cafe Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="input"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="logo" className="label">
                Logo URL
              </label>
              <input
                type="text"
                name="logo"
                id="logo"
                className="input"
                value={formData.logo}
                onChange={handleChange}
              />
            </div>
            
            <div className="sm:col-span-6">
              <label htmlFor="address" className="label">
                Address *
              </label>
              <input
                type="text"
                name="address"
                id="address"
                required
                className="input"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="phone" className="label">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                className="input"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="email" className="label">
                Email *
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className="sm:col-span-6">
              <label htmlFor="description" className="label">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows="3"
                className="input"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            
            <div className="sm:col-span-6">
              <label htmlFor="openingHours" className="label">
                Opening Hours
              </label>
              <input
                type="text"
                name="openingHours"
                id="openingHours"
                className="input"
                placeholder="e.g. Mon-Fri: 8am-6pm, Sat-Sun: 9am-5pm"
                value={formData.openingHours}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full sm:w-auto"
            >
              {isLoading ? 'Saving...' : 'Complete Setup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FirstTimeSetup;