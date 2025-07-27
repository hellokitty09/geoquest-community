import React from 'react';
import { Button } from '@/components/ui/button';
import { Map, Plus, List, BarChart3 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', icon: Map, label: 'Map' },
    { path: '/report', icon: Plus, label: 'Report' },
    { path: '/reports', icon: List, label: 'Reports' },
    { path: '/admin', icon: BarChart3, label: 'Admin' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Button
              key={item.path}
              variant={isActive ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 h-12 px-3"
            >
              <Icon className="h-4 w-4" />
              <span className="text-xs">{item.label}</span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;