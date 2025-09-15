import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../store/AppContext";
import toast from "react-hot-toast";
import Loader from "../../components/Loader"; // ✅ Import Loader component
import cafeLogo from "../../assets/cc.png";

function FirstTimeSetup() {
  const [formData, setFormData] = useState({
    name: "",
    owner: "", // ✅ Added cafe owner name
    address: "",
    phone: "",
    email: "",
    description: "",
    openingHours: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true); // ✅ loader initially true
  const { dispatch } = useAppContext();
  const navigate = useNavigate();

  // Show loader on initial mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200); // 1.2s full-page loader
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // clear error as user types
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.length < 3) {
      newErrors.name = "Cafe name must be at least 3 characters.";
    }
    if (!formData.owner || formData.owner.length < 3) {
      newErrors.owner = "Owner name must be at least 3 characters.";
    }
    if (!formData.address || formData.address.length < 5) {
      newErrors.address = "Address must be at least 5 characters.";
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (formData.description.length > 200) {
      newErrors.description = "Description cannot exceed 200 characters.";
    }
    if (formData.openingHours && formData.openingHours.length < 5) {
      newErrors.openingHours = "Opening hours must be at least 5 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setIsLoading(true); // ✅ loader during form submission

    setTimeout(() => {
      dispatch({
        type: "COMPLETE_SETUP",
        payload: {
          ...formData,
          id: `cafe-${Date.now()}`,
          joinedDate: new Date().toISOString(),
          status: "active",
        },
      });

      toast.success("Setup completed successfully!");
      setIsLoading(false);
      navigate("/");
    }, 1000);
  };

  // ✅ Show loader if isLoading
  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen flex bg-[#4a3a2f] text-white">
      {/* Left Side - Logo + Welcome */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-[#4a3a2f] p-8">
        <div className="text-center">
          <div className="mb-6 animate-bounce">
            <img
              src={cafeLogo}
              alt="Cafe Logo"
              className="mx-auto rounded-full border-4 border-white shadow-lg w-48 h-48 object-cover"
            />
          </div>
          <h2 className="text-4xl font-bold">Welcome to CafeChain</h2>
          <p className="mt-4 text-lg opacity-90">
            Let’s set up your café profile and start serving ☕
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 bg-white text-[#4a3a2f] flex items-center justify-center p-10">
        <div className="max-w-lg w-full">
          <h1 className="text-3xl font-extrabold mb-6">Set Up Your Cafe</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Cafe Name */}
            <div>
              <label htmlFor="name" className="block font-semibold">
                Cafe Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-[#4a3a2f]"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Owner Name */}
            <div>
              <label htmlFor="owner" className="block font-semibold">
                Owner Name *
              </label>
              <input
                type="text"
                name="owner"
                id="owner"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-[#4a3a2f]"
                value={formData.owner}
                onChange={handleChange}
              />
              {errors.owner && (
                <p className="text-red-600 text-sm mt-1">{errors.owner}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block font-semibold">
                Address *
              </label>
              <input
                type="text"
                name="address"
                id="address"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-[#4a3a2f]"
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && (
                <p className="text-red-600 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {/* Phone + Email */}
            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="phone" className="block font-semibold">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-[#4a3a2f]"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
              <div className="w-1/2">
                <label htmlFor="email" className="block font-semibold">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-[#4a3a2f]"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block font-semibold">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows="3"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-[#4a3a2f]"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
              {errors.description && (
                <p className="text-red-600 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Opening Hours */}
            <div>
              <label htmlFor="openingHours" className="block font-semibold">
                Opening Hours
              </label>
              <input
                type="text"
                name="openingHours"
                id="openingHours"
                placeholder="e.g. Mon-Fri: 8am-6pm, Sat-Sun: 9am-5pm"
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-[#4a3a2f]"
                value={formData.openingHours}
                onChange={handleChange}
              />
              {errors.openingHours && (
                <p className="text-red-600 text-sm mt-1">{errors.openingHours}</p>
              )}
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#4a3a2f] text-white font-semibold py-3 rounded-md hover:bg-[#3a2d24] transition"
              >
                {isLoading ? "Saving..." : "Complete Setup"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FirstTimeSetup;
