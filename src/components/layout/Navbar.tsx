import React from 'react';
import { GraduationCap, Menu } from 'lucide-react';

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ setSidebarOpen }) => {
  return (
    <div className="bg-indigo-700 fixed w-full top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="text-white p-2 rounded-md lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0 text-white flex items-center gap-2 ml-2 lg:ml-0">
              <GraduationCap className="h-8 w-8" />
              <span className="font-bold text-xl">EduRegister</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;