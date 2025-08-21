import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Coffee, Star, Trophy, User } from 'lucide-react';

const BottomNav = ({ activePage }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'cafes', label: 'Cafes', icon: Coffee, path: '/cafes' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
    { id: 'rewards', label: 'Rewards', icon: Star, path: '/rewards' },
    { id: 'profile', label: 'Profile', icon: User, path: '/profile' }
  ];

  return (
    <div className="bg-white shadow-soft border-t border-light-cream fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto px-2 py-2">
        <nav className="flex justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex flex-col items-center py-2 px-1 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-accent bg-light-gray' 
                    : 'text-gray-500 hover:text-accent'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-accent' : ''}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-accent' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default BottomNav; 