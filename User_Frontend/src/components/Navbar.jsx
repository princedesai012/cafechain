// components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Search } from 'lucide-react';
import { useAuth } from "../context/AuthContext"; // Assuming this path is correct

// Updated navigation links from your code
const navLinks = [
    { name: "Home", href: "/home" },
    { name: "Cafes", href: "/cafes" },
    { name: "Leaderboard", href: "/leaderboard" },
    { name: "Rewards", href: "/rewards" },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Animation variants for the mobile menu overlay
    const menuVariants = {
        hidden: { opacity: 0, y: '-100%' },
        visible: { opacity: 1, y: '0%', transition: { type: 'tween', duration: 0.3, ease: 'easeInOut' } },
        exit: { opacity: 0, y: '-100%', transition: { type: 'tween', duration: 0.3, ease: 'easeInOut' } },
    };

    return (
        <>
            {/* Import the Google Font for the logo */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
                    .font-logo {
                        font-family: 'Playfair Display', serif;
                    }
                `}
            </style>

            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            {/* The logo now correctly links to your home page */}
                            <Link to="/home" className="text-3xl font-bold text-[#4A3A2F] font-logo">
                                CafeChain
                            </Link>
                        </div>

                        {/* Desktop Navigation Links - Conditionally Rendered */}
                        {isAuthenticated && (
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4 relative">
                                    {navLinks.map((link) => (
                                        <div key={link.name} className="relative">
                                            <Link
                                                to={link.href}
                                                className="text-gray-600 hover:text-[#4A3A2F] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                                            >
                                                {link.name}
                                            </Link>
                                            {location.pathname === link.href && (
                                                <motion.div
                                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A3A2F]"
                                                    layoutId="underline"
                                                    initial={false}
                                                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Redesigned Search and Profile section - Conditionally Rendered */}
                        {isAuthenticated && (
                             <div className="hidden md:flex items-center gap-4">
                                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
                                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                                    <input
                                        type="text"
                                        placeholder="Search cafes..."
                                        className="bg-transparent outline-none text-sm w-32 transition-all focus:w-40"
                                    />
                                </div>
                                <button
                                    className="w-10 h-10 flex items-center justify-center bg-[#4A3A2F] rounded-full text-white font-bold overflow-hidden"
                                    onClick={() => navigate("/profile")}
                                    aria-label="Go to profile"
                                >
                                    {user?.profilePic ? (
                                        <img src={user.profilePic} alt="avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-white font-semibold">
                                            {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        {isAuthenticated && (
                            <div className="-mr-2 flex md:hidden">
                                <button
                                    onClick={toggleMenu}
                                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-white hover:bg-[#4A3A2F] focus:outline-none"
                                >
                                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && isAuthenticated && (
                        <motion.div
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="md:hidden fixed top-0 left-0 w-full h-screen bg-white z-40 pt-20"
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        onClick={toggleMenu} // Close menu on click
                                        className={`block px-3 py-4 rounded-md text-2xl font-medium ${
                                            location.pathname === link.href
                                                ? 'text-white bg-[#4A3A2F]'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="pt-8">
                                     <button 
                                        onClick={() => { navigate("/profile"); toggleMenu(); }}
                                        className="p-4 bg-gray-100 rounded-full text-gray-500 hover:bg-[#4A3A2F] hover:text-white transition-colors"
                                    >
                                        <User className="h-8 w-8" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    );
};

export default Navbar;
